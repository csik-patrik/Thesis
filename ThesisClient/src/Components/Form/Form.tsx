interface InputProps {
  title: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
}

export default function Form({ title, handleSubmit, children }: InputProps) {
  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md px-8 pt-6 pb-8">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          {children}
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition self-start"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
