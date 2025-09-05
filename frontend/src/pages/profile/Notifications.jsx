function Notifications() {
  return (
    <>
      <section className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Notifications
        </h3>
        <form className="space-y-4">
          {[
            "Recevoir des notifications par email",
            "Recevoir des notifications par SMS",
            "Alerte de dépassement de budget",
            "Rappels de factures à payer",
            "Conseils hebdomadaires d'économie",
            "Rapports mensuels",
          ].map((label, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked={idx !== 4}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <label className="text-gray-700">{label}</label>
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enregistrer les préférences
          </button>
        </form>
      </section>
    </>
  );
}

export default Notifications;
