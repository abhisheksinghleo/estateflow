"use client";

import { useMemo, useState } from "react";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTaxYearly, setPropertyTaxYearly] = useState(4200);
  const [insuranceYearly, setInsuranceYearly] = useState(1800);
  const [hoaMonthly, setHoaMonthly] = useState(120);

  const results = useMemo(() => {
    const principal = Math.max(homePrice - downPayment, 0);
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    let monthlyPrincipalInterest = 0;
    if (principal > 0 && totalPayments > 0) {
      if (monthlyRate === 0) {
        monthlyPrincipalInterest = principal / totalPayments;
      } else {
        monthlyPrincipalInterest =
          (principal *
            (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1);
      }
    }

    const monthlyTax = Math.max(propertyTaxYearly, 0) / 12;
    const monthlyInsurance = Math.max(insuranceYearly, 0) / 12;
    const monthlyHoa = Math.max(hoaMonthly, 0);

    const totalMonthly =
      monthlyPrincipalInterest + monthlyTax + monthlyInsurance + monthlyHoa;
    const totalInterestPaid =
      monthlyPrincipalInterest * totalPayments - principal > 0
        ? monthlyPrincipalInterest * totalPayments - principal
        : 0;

    return {
      principal,
      monthlyPrincipalInterest,
      monthlyTax,
      monthlyInsurance,
      monthlyHoa,
      totalMonthly,
      totalInterestPaid,
    };
  }, [
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxYearly,
    insuranceYearly,
    hoaMonthly,
  ]);

  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient md:p-8">
      <div className="mb-6">
        <h2 className="font-display text-headline-sm text-on-surface">
          Mortgage Calculator
        </h2>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Estimate your monthly payment. Great for quick planning during search.
        </p>
        <p className="mt-2 text-label-sm text-outline">
          TODO: Replace local calculations with backend finance APIs for taxes,
          PMI, and region-specific rules.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <InputRow
            id="homePrice"
            label="Home Price"
            value={homePrice}
            setValue={setHomePrice}
            min={0}
            step={1000}
            prefix="$"
          />
          <InputRow
            id="downPayment"
            label="Down Payment"
            value={downPayment}
            setValue={setDownPayment}
            min={0}
            step={1000}
            prefix="$"
          />
          <InputRow
            id="interestRate"
            label="Interest Rate"
            value={interestRate}
            setValue={setInterestRate}
            min={0}
            max={25}
            step={0.05}
            suffix="%"
          />
          <InputRow
            id="loanTerm"
            label="Loan Term (Years)"
            value={loanTerm}
            setValue={setLoanTerm}
            min={5}
            max={40}
            step={1}
          />
          <InputRow
            id="propertyTaxYearly"
            label="Property Tax (Yearly)"
            value={propertyTaxYearly}
            setValue={setPropertyTaxYearly}
            min={0}
            step={100}
            prefix="$"
          />
          <InputRow
            id="insuranceYearly"
            label="Home Insurance (Yearly)"
            value={insuranceYearly}
            setValue={setInsuranceYearly}
            min={0}
            step={100}
            prefix="$"
          />
          <InputRow
            id="hoaMonthly"
            label="HOA Fees (Monthly)"
            value={hoaMonthly}
            setValue={setHoaMonthly}
            min={0}
            step={10}
            prefix="$"
          />
        </div>

        {/* Results panel — tonal surface shift instead of border */}
        <div className="rounded-xl bg-surface-container-low p-5">
          <h3 className="font-display text-title-md text-on-surface">
            Estimated Monthly Breakdown
          </h3>

          <dl className="mt-4 space-y-3 text-body-sm">
            <SummaryRow
              label="Loan Amount"
              value={formatCurrency(results.principal)}
            />
            <SummaryRow
              label="Principal & Interest"
              value={formatCurrency(results.monthlyPrincipalInterest)}
            />
            <SummaryRow
              label="Property Tax"
              value={formatCurrency(results.monthlyTax)}
            />
            <SummaryRow
              label="Insurance"
              value={formatCurrency(results.monthlyInsurance)}
            />
            <SummaryRow
              label="HOA"
              value={formatCurrency(results.monthlyHoa)}
            />
          </dl>

          {/* Tonal bg shift divider — no 1px border per No-Line rule */}
          <div className="my-4 h-1 rounded-full bg-surface-container" />

          <div className="flex items-end justify-between">
            <div>
              <p className="text-body-sm text-on-surface-variant">Estimated Monthly Payment</p>
              <p className="font-display text-headline-sm text-primary">
                {formatCurrency(results.totalMonthly)}
              </p>
            </div>
            <span className="rounded-full bg-secondary-container px-3 py-1 text-label-sm font-medium text-primary">
              Mock estimate
            </span>
          </div>

          <p className="mt-4 text-label-sm text-outline">
            Total interest over {loanTerm} years:{" "}
            <span className="font-medium text-on-surface">
              {formatCurrency(results.totalInterestPaid)}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function InputRow({
  id,
  label,
  value,
  setValue,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-label-sm font-medium text-on-surface">
        {label}
      </span>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => setValue(Number(e.target.value))}
          className={`input-base ${prefix ? "pl-8" : ""} ${suffix ? "pr-8" : ""}`}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="font-medium text-on-surface">{value}</dd>
    </div>
  );
}
