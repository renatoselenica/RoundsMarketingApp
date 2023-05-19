import Image from "next/image";
import { getAppData } from "@/api/api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

type Screenshot = {
  createdAt: string;
  screenshotPath: string;
};

type GetAppResponse = {
  createdAt: string;
  packageName: string;
  packageUrl: string;
  screenshots: Screenshot[];
};

export default function AppPage() {
  const router = useRouter();
  const packageName = router.query.packageName as string;
  const [appData, setAppData] = useState<GetAppResponse | null>(null);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState<string | null>(null);

  const handleClick = (src: string) => {
    setFullscreenImageSrc(fullscreenImageSrc === src ? null : src);
  };

  useEffect(() => {
    let ignore = false;
    setAppData(null);
    if (packageName === undefined) {
      return;
    }
    getAppData(packageName).then((result) => {
      if (!ignore) {
        setAppData(result.data);
      }
    });
    // clean up api call in case of unmount
    return () => {
      ignore = true;
    };
  }, [packageName]);

  if (!appData) {
    return (
      <div className="container py-6 px-12 mx-auto min-h-screen bg-gray-50">
        Loading...
      </div>
    );
  }

  return (
    <main className="flex flex-col p-4 pt-10 m-auto max-w-4xl">
      <Link href="/">
        <p className="py-8 text-center text-blue-500">Back Home</p>
      </Link>
      <h1 className="text-2xl font-semibold text-center">{packageName}</h1>
      <p className="pt-8 pb-4 font-semibold text-center">
        Link:{" "}
        <a target="_blank" href={appData.packageUrl} className="text-blue-500">
          {appData.packageUrl}
        </a>
      </p>
      <p className="pb-4 font-semibold text-center">
        Start time:{" "}
        <span className="font-normal">
          {new Date(appData.createdAt).toUTCString()}
        </span>
      </p>
      {appData.screenshots.map((screenshot) => (
        <div key={screenshot.createdAt} className="flex flex-col items-center">
          <div className="my-14 w-full h-1 bg-gray-500 rounded-lg"></div>
          <p className="pb-4">
            Screenshot time:{" "}
            <span className="font-normal">
              {new Date(screenshot.createdAt).toUTCString()}
            </span>
          </p>
          <Image
            onClick={() => handleClick(screenshot.screenshotPath)}
            className="w-full rounded-sm shadow-lg"
            width={1080}
            height={1920}
            src={screenshot.screenshotPath}
            alt="screenshot"
          />
          <div
            className={`fixed bg-gray-900 inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${screenshot.screenshotPath === fullscreenImageSrc ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            onClick={() => handleClick(screenshot.screenshotPath)}
          >
            <Image
              src={screenshot.screenshotPath}
              width={1080}
              height={1920}
              alt="full view"
              className={`w-screen h-screen p-16 object-contain transition-transform duration-500 ease-in-out ${screenshot.screenshotPath === fullscreenImageSrc ? 'scale-100' : 'scale-0'}`}
            />
          </div>
        </div>
      ))}
    </main>
  );
}
