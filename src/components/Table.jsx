import React from "react";

export default function Table({ columns, rows, rowIds, onRowClick }) {
  const handleRowClick = (idx) => {
    if (onRowClick && rowIds && rowIds[idx]) {
      onRowClick(rowIds[idx]);
    }
  };

  return (
    <div className="overflow-hidden rounded-md shadow-soft border border-black/10">
      <table className="w-full text-[11px] border-collapse">
        <thead className="bg-sf-green text-sf-textBlack uppercase text-sm">
          <tr>
            {columns.map((c, index) => (
              <th
                key={c}
                className={`text-left px-2 py-1 border-black ${
                  index !== columns.length - 1 ? "border-r" : ""
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {rows.map((r, idx) => (
            <tr
              key={idx}
              className={`border-t border-black text-sm ${
                onRowClick && rowIds && rowIds[idx]
                  ? "cursor-pointer hover:bg-gray-100 transition-colors"
                  : ""
              }`}
              onClick={() => handleRowClick(idx)}
            >
              {r.map((cell, i) => (
                <td
                  key={i}
                  className={`px-2 py-1 border-black ${
                    i !== r.length - 1 ? "border-r" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}