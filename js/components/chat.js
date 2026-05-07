// chat.js — AI 對話視窗
// 同一份元件用在:
//   1. 行動階段地圖下方常駐
//   2. 生存報告反思模式右欄
// AI 回覆先用 mock(HD_API.postChat)

(function () {
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderMessages(state) {
    var html = "";
    var msgs = state.chatMessages || [];
    for (var i = 0; i < msgs.length; i++) {
      var m = msgs[i];
      html +=
        '<div class="hd-chat__msg hd-chat__msg--' + m.from + '">' +
          '<div class="hd-chat__bubble">' + escapeHtml(m.text) + '</div>' +
        '</div>';
    }
    return html;
  }

  // 把目前對話加上一條訊息(不取代既有陣列引用要小心,直接 set 新陣列)
  function appendMessage(msg) {
    var prev = window.HD_STATE.get().chatMessages || [];
    var next = prev.slice();
    next.push(msg);
    window.HD_STATE.set({ chatMessages: next });
  }

  // mode: "action"(行動階段地圖下方) | "reflection"(報告反思模式右欄)
  window.hdRenderChat = function (state, mode) {
    var root = document.createElement("section");
    root.className = "hd-chat";
    root.setAttribute("data-mode", mode || "action");

    var headTitle = mode === "reflection" ? "個人反思 · AI 對話" : "AI 對話";
    var headSub   = mode === "reflection" ? "你做了什麼?為什麼?" : "可以隨時跟 AI 聊聊";

    root.innerHTML =
      '<header class="hd-chat__head">' +
        '<div class="hd-chat__head-icon">' + window.hdIconSvg("sparkle", 14) + '</div>' +
        '<div class="hd-chat__head-title">' + headTitle + '</div>' +
        '<div class="hd-chat__head-sub">' + headSub + '</div>' +
      '</header>' +
      '<div class="hd-chat__body hd-scroll">' + renderMessages(state) + '</div>' +
      '<form class="hd-chat__form">' +
        '<textarea class="hd-chat__input" rows="1" placeholder="說說你的想法..."></textarea>' +
        '<button class="hd-chat__send" type="submit">' +
          window.hdIconSvg("send", 14) + '<span>送出</span>' +
        '</button>' +
      '</form>';

    var body  = root.querySelector(".hd-chat__body");
    var form  = root.querySelector(".hd-chat__form");
    var input = root.querySelector(".hd-chat__input");
    var send  = root.querySelector(".hd-chat__send");

    // 自動滾到底
    requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; });

    function refreshDisabled() {
      send.disabled = !input.value.trim();
    }
    refreshDisabled();
    input.addEventListener("input", refreshDisabled);

    // Enter 送出 / Shift+Enter 換行
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event("submit"));
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      // 推使用者訊息
      appendMessage({ from: "user", text: text });
      // 呼叫 mock AI(回會觸發 re-render,輸入框會被重建,所以 focus 用 RAF 復原)
      window.HD_API.postChat(text).then(function (res) {
        appendMessage({ from: "ai", text: res.reply });
      });
    });

    return root;
  };
})();
