export const config = {
    steamApi: {
        listAllApps: 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json',
        getAppInfo: 'http://store.steampowered.com/api/appdetails?appids=%APPID%',
        cooldownInMs: 5000
    }
};
