export async function getApps() {
  try {
    const data = await fetch(`api/apps/getApps`);
    return data.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getAppData(packageName: string) {
  try {
    const data = await fetch(`api/apps/getApp/${packageName}`);
    return data.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addApp(packageUrl: string) {
  try {
    const response = await fetch("/api/apps/addApp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ packageUrl }),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
