const StudiosUnavailable = ({ label }: { label: string }) => (
  <section
    aria-label={label}
    role="status"
    className="mx-auto my-6 max-w-6xl rounded-xl border border-dashed border-border bg-[#f7f5f0] dark:bg-[#14100c] px-6 py-8 text-center"
  >
    <p className="text-sm font-medium text-foreground">
      Studio listings are temporarily unavailable. Please try again later.
    </p>
  </section>
);

export default StudiosUnavailable;
