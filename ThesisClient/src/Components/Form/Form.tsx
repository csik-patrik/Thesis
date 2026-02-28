import CustomLink from "../Shared/CustomLink";

interface FormProps {
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
}: FormProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="px-8 py-5 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Card body */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="flex flex-col">
            {children}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-5 mt-2 border-t border-gray-100">
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
              >
                Submit
              </button>
              <CustomLink color="gray" label="Cancel" to={returnUri} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
