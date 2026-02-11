import { Link } from "react-router-dom";

interface InputProps {
  title: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  returnUri: string;
  children?: React.ReactNode;
}

export default function Form({
  title,
  handleSubmit,
  returnUri,
  children,
}: InputProps) {
  return (
    <div className="flex w-full items-center justify-center p-6">
      <div className="w-full max-w-lg  rounded-lg shadow-md px-8 pt-6 pb-8">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          {children}
          <div className="flex flex-row gap-2">
            <button
              type="button"
              className="mt-4 bg-stone-600 text-white px-4 py-2 rounded-md hover:bg-stone-700 transition self-start"
            >
              <Link to={returnUri}>Back</Link>
            </button>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition self-start"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
