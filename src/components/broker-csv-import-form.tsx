"use client";

import { useState } from "react";
import { importBrokerCsv } from "@/lib/investing-actions";
import type { PortfolioAsset, PortfolioBucket } from "@/lib/types";

export function BrokerCsvImportForm({
  assets,
  buckets,
}: {
  assets: PortfolioAsset[];
  buckets: PortfolioBucket[];
}) {
  const [rawCsv, setRawCsv] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Array<Record<string, string>>>([]);
  const [mapping, setMapping] = useState({
    assetName: "",
    marketValue: "",
    note: "",
    price: "",
    quantity: "",
    ticker: "",
  });
  const previewRows = rows.slice(0, 5);
  const unmatchedRows =
    mapping.assetName && mapping.ticker
      ? rows
          .map((row, index) => ({
            index,
            name: row[mapping.assetName] ?? "",
            ticker: row[mapping.ticker] ?? "",
          }))
          .filter((row) => !findMatchingAsset(assets, row.ticker, row.name))
      : [];
  const bucketsByAxis = {
    geography: buckets.filter((bucket) => bucket.axisId === "geography"),
    role: buckets.filter((bucket) => bucket.axisId === "role"),
    theme: buckets.filter((bucket) => bucket.axisId === "theme"),
  };
  const requiredMappingReady =
    mapping.assetName &&
    mapping.ticker &&
    mapping.quantity &&
    mapping.price &&
    mapping.marketValue;

  async function handleFileChange(file?: File) {
    if (!file) {
      return;
    }

    const text = await file.text();
    const parsedRows = parseCsvText(text);
    const parsedHeaders = Object.keys(parsedRows[0] ?? {});
    setRawCsv(text);
    setRows(parsedRows);
    setHeaders(parsedHeaders);
    setMapping({
      assetName: guessHeader(parsedHeaders, ["name", "asset", "종목명", "자산명"]),
      marketValue: guessHeader(parsedHeaders, ["market", "value", "평가", "금액"]),
      note: guessHeader(parsedHeaders, ["note", "memo", "메모", "비고"]),
      price: guessHeader(parsedHeaders, ["price", "단가", "가격"]),
      quantity: guessHeader(parsedHeaders, ["quantity", "qty", "수량"]),
      ticker: guessHeader(parsedHeaders, ["ticker", "symbol", "code", "종목코드", "티커"]),
    });
  }

  return (
    <form action={importBrokerCsv} className="space-y-6">
      <input name="rawCsv" type="hidden" value={rawCsv} />
      <section className="rounded-3xl border border-white/10 bg-[#10130f]/90 p-5 shadow-lg shadow-black/15">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">
            Step 1
          </p>
          <h3 className="mt-1 text-lg font-semibold text-stone-50">CSV 업로드</h3>
        </div>
        <input
          accept=".csv,text/csv"
          className="block w-full rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-sm text-stone-300 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone-950"
          onChange={(event) => handleFileChange(event.target.files?.[0])}
          type="file"
        />
        <p className="mt-3 text-sm text-stone-400">
          CSV는 브라우저에서 미리보기로 읽고, 최종 저장 시 서버 액션에서 다시 파싱합니다.
        </p>
      </section>

      {headers.length > 0 ? (
        <>
          <section className="rounded-3xl border border-white/10 bg-[#10130f]/90 p-5 shadow-lg shadow-black/15">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">
                Step 2
              </p>
              <h3 className="mt-1 text-lg font-semibold text-stone-50">컬럼 매핑</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <MappingSelect label="자산명" name="assetNameColumn" headers={headers} value={mapping.assetName} onChange={(value) => setMapping({ ...mapping, assetName: value })} required />
              <MappingSelect label="티커" name="tickerColumn" headers={headers} value={mapping.ticker} onChange={(value) => setMapping({ ...mapping, ticker: value })} required />
              <MappingSelect label="수량" name="quantityColumn" headers={headers} value={mapping.quantity} onChange={(value) => setMapping({ ...mapping, quantity: value })} required />
              <MappingSelect label="가격" name="priceColumn" headers={headers} value={mapping.price} onChange={(value) => setMapping({ ...mapping, price: value })} required />
              <MappingSelect label="평가금액" name="marketValueColumn" headers={headers} value={mapping.marketValue} onChange={(value) => setMapping({ ...mapping, marketValue: value })} required />
              <MappingSelect label="메모(선택)" name="noteColumn" headers={headers} value={mapping.note} onChange={(value) => setMapping({ ...mapping, note: value })} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#10130f]/90 p-5 shadow-lg shadow-black/15">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">
                Step 3
              </p>
              <h3 className="mt-1 text-lg font-semibold text-stone-50">미리보기와 신규 자산 분류</h3>
            </div>
            <label className="mb-4 flex items-center gap-2 text-sm text-stone-300">
              <input className="h-4 w-4 accent-amber-200" defaultChecked name="createMissing" type="checkbox" />
              매칭되지 않는 종목은 새 자산으로 생성
            </label>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  <tr>
                    {headers.map((header) => (
                      <th className="px-3 py-2" key={header}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, rowIndex) => (
                    <tr className="border-t border-white/10" key={rowIndex}>
                      {headers.map((header) => (
                        <td className="px-3 py-2 text-stone-300" key={header}>
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {requiredMappingReady && unmatchedRows.length > 0 ? (
              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold text-stone-100">
                  신규 자산 분류 지정
                </p>
                {unmatchedRows.map((row) => (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" key={row.index}>
                    <p className="text-sm font-semibold text-stone-100">
                      {row.name} ({row.ticker})
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <BucketSelect axisId="geography" index={row.index} label="지역" options={bucketsByAxis.geography} />
                      <BucketSelect axisId="theme" index={row.index} label="테마" options={bucketsByAxis.theme} />
                      <BucketSelect axisId="role" index={row.index} label="역할" options={bucketsByAxis.role} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <div className="flex justify-end">
            <button
              className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!requiredMappingReady || !rawCsv}
              type="submit"
            >
              CSV 가져오기 저장
            </button>
          </div>
        </>
      ) : null}
    </form>
  );
}

function MappingSelect({
  headers,
  label,
  name,
  onChange,
  required,
  value,
}: {
  headers: string[];
  label: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone-300">
      <span>{label}</span>
      <select
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-200/50"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      >
        <option value="">선택</option>
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
    </label>
  );
}

function BucketSelect({
  axisId,
  index,
  label,
  options,
}: {
  axisId: string;
  index: number;
  label: string;
  options: PortfolioBucket[];
}) {
  return (
    <label className="grid gap-2 text-sm text-stone-300">
      <span>{label}</span>
      <select
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-200/50"
        name={`import_${index}_${axisId}`}
        required
      >
        {options.map((option) => (
          <option key={option.bucketId} value={option.bucketId}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function parseCsvText(csvText: string) {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function guessHeader(headers: string[], candidates: string[]) {
  return (
    headers.find((header) =>
      candidates.some((candidate) => header.toLowerCase().includes(candidate.toLowerCase())),
    ) ?? ""
  );
}

function findMatchingAsset(assets: PortfolioAsset[], ticker: string, assetName: string) {
  const normalizedTicker = ticker.trim().toLowerCase();
  const normalizedName = assetName.trim().toLowerCase();

  return assets.find(
    (asset) =>
      asset.ticker.trim().toLowerCase() === normalizedTicker ||
      asset.name.trim().toLowerCase() === normalizedName,
  );
}
