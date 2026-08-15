"use client";

import { useActionState, useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";
import { createBusRequestAction, type BusRequestActionState } from "@/lib/data/busRequests";
import { Field } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

const initialState: BusRequestActionState = { error: null };

const KNOWN_UNIVERSITIES = [
  "Harvard Aftabnagar",
  "MIT Badda",
  "Oxford Bashundhara",
  "Stanford Kuratoli",
  "BUET Tejgaon",
];

export function BusRequestForm() {
  const [state, formAction, pending] = useActionState(createBusRequestAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Field
        id="universityName"
        name="universityName"
        label="University name"
        placeholder="e.g. Harvard Aftabnagar"
        list="known-universities"
        required
      />
      <datalist id="known-universities">
        {KNOWN_UNIVERSITIES.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <div className="grid grid-cols-2 gap-4">
        <Field
          id="busesRequired"
          name="busesRequired"
          label="Buses required"
          type="number"
          min={1}
          max={5}
          defaultValue={1}
          required
        />
        <Field id="requiredDate" name="requiredDate" label="Required date" type="date" required />
      </div>

      <Field id="requiredTime" name="requiredTime" label="Required time" type="time" required />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="purpose" className="text-sm font-medium text-text">
          Purpose / event description
        </label>
        <textarea
          id="purpose"
          name="purpose"
          rows={3}
          placeholder="e.g. Department industrial visit to Gazipur"
          className="rounded-xl border border-border-strong bg-white px-4 py-2.5 text-sm text-text placeholder:text-gray outline-none transition-colors focus:border-maroon"
          required
        />
      </div>

      <Field
        id="pickupLocation"
        name="pickupLocation"
        label="Pickup location"
        placeholder="e.g. Campus main gate"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-text">
          Additional requirements or notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Optional"
          className="rounded-xl border border-border-strong bg-white px-4 py-2.5 text-sm text-text placeholder:text-gray outline-none transition-colors focus:border-maroon"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      {state.success && (
        <p className="flex items-center gap-2 rounded-lg bg-success-bg px-3 py-2 text-sm text-success">
          <CircleCheck size={16} /> Bus request submitted successfully.
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "Submitting..." : "Submit Bus Request"}
      </Button>
    </form>
  );
}
