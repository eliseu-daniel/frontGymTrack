export default function PatientsDetails() {



return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Ficha do paciente
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        <label className="mb-1 block text-base font-serif">Nome</label>
        <input
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
          value={"João da Silva"}
          onChange={(e) => setField("nome", e.target.value)}
        />

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-80">
              <label className="mb-1 block text-base font-serif">
                Treino
              </label>
              <textarea className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2" />
            </div>

            <div className="w-80">
              <label className="mb-1 block text-base font-serif">
                Dieta
              </label>
              <textarea className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2" />
            </div>
          </div>

          <div className="w-80">
            <label className="mb-1 block text-base font-serif">
              Antropometria
            </label>
            <textarea className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2" />
          </div>
        </div>
      </div>
     
    </div>
  );
}