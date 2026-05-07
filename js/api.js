// api.js — 後端 API 抽象層
// 目前直接回 mock(來自 data.js),介面設計為 Promise,
// 之後接真實後端時只動本檔內部實作。

(function () {
  function delay(ms, value) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(value); }, ms);
    });
  }

  window.HD_API = {
    // 取得當前玩家 / 遊戲狀態
    getGameState: function () {
      return delay(0, {
        player: window.HD_PLAYER_DEFAULT,
        game:   window.HD_GAME,
      });
    },

    // 取得四個棲地資料
    getHabitats: function () {
      return delay(0, window.HD_HABITATS);
    },

    // 取得性狀清單
    getTraits: function () {
      return delay(0, window.HD_TRAITS);
    },

    // 取得指定回合 / 玩家的生存報告
    getReport: function (/* round, playerId */) {
      return delay(0, window.HD_REPORT);
    },

    // 送出本回合行動(目前只 echo)
    postActions: function (queued) {
      return delay(0, { ok: true, queued: queued });
    },

    // 送 AI 對話訊息(目前 mock echo)
    postChat: function (text) {
      return delay(200, { reply: "(AI 串接待補)我聽到你說:" + text });
    },
  };
})();
