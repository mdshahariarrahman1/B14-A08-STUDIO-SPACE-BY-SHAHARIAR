const StudiosUnavailable = ({ label }: { label: string }) => (
  <section
    aria-label={label}
    role="status"
    className="mx-auto my-6 max-w-6xl rounded-xl border border-dashed border-neutral-300 bg-[#f7f5f0] px-6 py-8 text-center"
  >
    <p className="text-sm font-medium text-neutral-800">
      Studio listings are temporarily unavailable. Please try again later.
    </p>
  </section>
);

export default StudiosUnavailable;
