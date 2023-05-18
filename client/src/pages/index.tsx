import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex flex-col p-4 pt-10 m-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-center">Marketing App for google play apps</h1>
      <form className="flex my-12">
        <input className="px-2 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline" name="google-play-link" type="text" placeholder="Google play link" />
        <button className="py-2 px-4 m-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" type="submit">Add</button>
      </form>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Package Name</th>
            <th className="py-2 px-4 border">Monitor Count</th>
            <th className="py-2 px-4 border">View Monitoring</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border">
              <Image src="/images/placeholder.png" alt="Picture of the author" width={50} height={50} />
            </td>
            <td className="py-2 px-4 border">Intro to CSS</td>
            <td className="py-2 px-4 border">Adam</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="py-2 px-4 border">
              <Image src="/images/placeholder.png" alt="Picture of the author" width={50} height={50} />
            </td>
            <td className="py-2 px-4 border">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
            <td className="py-2 px-4 border">Adam</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border">
              <Image src="/images/placeholder.png" alt="Picture of the author" width={50} height={50} />
            </td>
            <td className="py-2 px-4 border">Intro to JavaScript</td>
            <td className="py-2 px-4 border">Chris</td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}
