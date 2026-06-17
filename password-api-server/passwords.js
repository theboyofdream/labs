const MESSAGES = Object.freeze({
  phpmyadmin: [
    "Deploy DB credentials? No rollback if you mess prod.",
    "Entering phpMyAdmin god mode. Continue?",
    "This better not be production, right?",
    "Speedrunning database access any%?",
    "Hope you know which server this is.",
    "Trusting stored creds like a brave dev?",
    "If this drops tables, it’s on you.",
    "SQL wizard mode activated?",
    "May your queries be indexed.",
    "Proceed to poke the database?",
    "Prod DB + no backup = character development.",
    "YOLOing into database config, nice.",
    "Hope you like living dangerously.",
    "One wrong query = instant regret.",
    "Readonly? Nah, we ball.",
    "You about to SELECT * your career away.",
    "Schema about to feel your presence.",
    "Indexes watching you nervously.",
    "This query better be worth it.",
    "Permission denied? Deserved tbh.",
    "Live data… spicy choice.",
    "No WHERE clause? Bold strategy.",
    "DBA ghost just woke up.",
    "Hope this isn't the main cluster 💀",
    "You vs production… place your bets.",
    "Latency gods, be kind.",
    "Autocommit ON? say less.",
    "Rollback button missing… interesting.",
    "Audit logs gonna snitch on you.",
    "Just because you can… doesn’t mean you should.",
  ],
  eprompto: [
    "Logging into dashboard… act natural 🕶️",
    "Welcome back, boss. Try not to break prod.",
    "Another day, another dashboard takeover.",
    "Admin powers detected. Use wisely ⚡",
    "Hope you remember what this button does.",
    "Dashboard unlocked. Chaos optional.",
    "You again? Alright, go ahead.",
    "Stats won’t fix themselves… unfortunately.",
    "Entering control room. No panic clicks.",
    "Let’s pretend everything is under control.",
    "Loading dashboard… confidence not included.",
    "Time to stare at graphs and feel important.",
    "Hope the numbers look better today 🤞",
    "Deploys are temporary, dashboards are forever.",
    "Click carefully, this ain't Figma.",
    "You break it, you own it 😌",
    "Ah yes, the ‘make things worse’ panel.",
    "Welcome to the land of metrics and lies.",
    "Dashboard ready. Coffee not included ☕",
    "Everything is fine… probably.",
    "Just a quick login… famous last words.",
    "Data loading… expectations lowering.",
    "Hope alerts are quiet today 🔕",
    "No bugs today? suspicious.",
    "Let’s go pretend we know what we’re doing.",
    "Another login, another mystery to solve.",
    "Graphs go up = good. Right?",
    "Welcome back, captain. Ship still floating.",
    "Nothing’s broken… yet.",
    "Let’s keep production alive today 🙏",
  ],
});

module.exports = {
  // phpMyAdmin passwords
  "/^localhost(:80|:8080)?\/phpmyadmin$/": {
    credentials: [
      {
        username: "root",
        password: "root",
      },
    ],
    messages: MESSAGES.phpmyadmin,
  },
  "developer.eprompto.com\/phpmyadmin$/": {
    credentials: [
      {
        username: "devteam",
        password: "FVJMvwx*kq*PVLFF",
      },
    ],
    messages: MESSAGES.phpmyadmin,
  },
  "businessv3.eprompto.com\/phpmyadmin$/": {
    credentials: [
      {
        username: "devteam_prod",
        password: "p*dluMixboXoFf0f",
      },
    ],
    messages: MESSAGES.phpmyadmin,
  },
  // eprompto portals
  "/^localhost(:80|:8080)?\/login/": {
    credentials: [
      {
        username: "abhijeet.jagtap@crestit.in",
        password: "A12345$a",
      },
    ],
    messages: MESSAGES.eprompto,
  },
  "developer.eprompto.com\/login$/": {
    credentials: [
      {
        username: "abhijeet.jagtap@crestit.in",
        password: "A12345$a",
      },
    ],
    messages: MESSAGES.eprompto,
  },
  "demo.crestit.in\/login$/": {
    credentials: [
      {
        username: "aparna@crestit.in",
        password: "A12345$a",
      },
    ],
    messages: MESSAGES.eprompto,
  },
  "businessv3.eprompto.com\/login$/": {
    credentials: [
      {
        username: "satyjeet@crestit.in",
        password: "Satya@007",
      },
    ],
    messages: MESSAGES.eprompto,
  },
};
