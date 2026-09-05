export default function MerchantPlaceholder({ title }) {
  return (
    <main className="simple-page">
      <PageHeader
        kicker="MERCHANT CONSOLE"
        title={title}
        description="Manage this AgentPay commerce module."
      />

      <EmptyState
        icon={Sparkles}
        title={`${title} is ready`}
        description="Connect this module to your backend APIs and real-time merchant data."
      />
    </main>
  );
}

/* =========================================================
   COMMON
========================================================= */
