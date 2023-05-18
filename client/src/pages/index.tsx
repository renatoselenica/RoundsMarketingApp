import { useEffect, useState } from "react";
import Link from "next/link";
import { addApp, getApps } from "@/api/api";
import { validateUrl } from "@/utils/validateUrl";

type AddAppResponse = {
  success: boolean;
  message: string;
};

type ScreenshotsCount = {
  screenshots: number;
};

type GetAppsResponse = {
  packageName: string;
  _count: ScreenshotsCount;
};

function MonitorTable({ packageList }: { packageList: GetAppsResponse[] }) {
  return (
    <>
      {packageList.length !== 0 ? (
        <table className="table-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Package Name</th>
              <th className="py-2 px-4 border">Monitor Count</th>
              <th className="py-2 px-4 border">View Monitoring</th>
            </tr>
          </thead>
          <tbody>
            {packageList.map((item: any) => (
              <tr key={item.packageName}>
                <td className="py-2 px-4 border">{item.packageName}</td>
                <td className="py-2 px-4 text-center border">
                  {item._count.screenshots}
                </td>
                <td className="py-2 px-4 border">
                  <Link href={`/apps/${item.packageName}`}>
                    <button
                      className="py-2 px-4 m-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                      type="submit"
                    >
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No links to monitor</div>
      )}
    </>
  );
}

export default function Home() {
  const [packageUrl, setPackageUrl] = useState("");
  const [packageList, setPackageList] = useState<GetAppsResponse[] | []>([]);

  useEffect(() => {
    let ignore = false;
    setPackageList([]);
    getApps().then((result) => {
      if (!ignore) {
        setPackageList(result.data);
      }
    });
    // clean up api call in case of unmount
    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!packageUrl || !validateUrl(packageUrl)) {
      alert("Please enter a valid package url");
      return;
    }

    const response = await addApp(packageUrl);

    if (response && response.ok) {
      // handle successful form submission
      setPackageUrl("");
      getApps().then((result) => {
        setPackageList(result.data);
      });
    } else if (response) {
      const errorMessage: AddAppResponse = await response.json();
      alert(Error(errorMessage.message));
    } else {
      alert(Error("Something went wrong"));
    }
  };

  if (!packageList) {
    return (
      <div className="container py-6 px-12 mx-auto min-h-screen bg-gray-50">
        Loading...
      </div>
    );
  }

  return (
    <main className="flex flex-col p-4 pt-10 m-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-center">
        Marketing App for google play apps
      </h1>
      <form className="flex items-center my-12" onSubmit={handleSubmit}>
        <input
          className="px-2 w-full h-12 leading-tight text-gray-700 rounded border shadow appearance-none focus:ring-1 focus:ring-blue-200 focus:outline-none focus:shadow-outline"
          type="text"
          value={packageUrl}
          onChange={(e) => setPackageUrl(e.target.value)}
          placeholder="Google play link"
        />
        <button
          className="px-4 m-2 h-12 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          type="submit"
        >
          Add
        </button>
      </form>
      <MonitorTable packageList={packageList} />
    </main>
  );
}
