async function loadSteam() {
  try {
    const res = await fetch('/assets/data/steam.json');
    const data = await res.json();

    const game = data?.response?.games?.[0];
    if (!game) {
      document.getElementById('steam-game').textContent = 'нет активности';
      return;
    }

    const hours = Math.floor(game.playtime_forever / 60);
    const hoursRecent = Math.floor(game.playtime_2weeks / 60);
    const iconUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

    document.getElementById('steam-icon').src = iconUrl;
    document.getElementById('steam-game').textContent = game.name;
    document.getElementById('steam-time').textContent = `${hoursRecent} ч. за 2 недели · ${hours} ч. всего`;
  } catch {
    document.getElementById('steam-game').textContent = 'ошибка загрузки';
  }
}

loadSteam();