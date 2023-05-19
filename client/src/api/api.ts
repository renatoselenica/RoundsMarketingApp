export async function getApps() {
  try {
    const data = await fetch(`api/apps/get-apps`);
    return data.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getAppData(packageName: string) {
  try {
    const data = await fetch(`api/apps/get-app?packageName=${packageName}`);
    return data.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addApp(packageUrl: string) {
  try {
    const response = await fetch("/api/apps/add-app", {
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
