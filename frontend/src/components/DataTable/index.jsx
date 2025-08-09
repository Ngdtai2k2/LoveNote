import React from 'react';
import { Typography } from '@material-tailwind/react';

export default function DataTable({ columns, data, t }) {
  return (
    <div className="overflow-scroll mt-4 px-0">
      <table className="w-full min-w-max table-auto rounded text-left border-separate border-spacing-0 border border-blue-gray-50 dark:border-gray-700">
        <thead>
          <tr>
            {columns.map(({ label, key, width }) => (
              <th
                key={key}
                style={width ? { width } : undefined}
                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <Typography
                  variant="small"
                  className="font-normal leading-none opacity-70 text-blue-gray-800 dark:text-blue-gray-300"
                >
                  {t ? t(label) : label}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => {
            const isLast = index === data.length - 1;
            const classes = isLast
              ? 'p-4 dark:text-gray-200'
              : 'p-4 border-b border-blue-gray-50 dark:border-gray-700 dark:text-gray-200';

            return (
              <tr key={row.id || index} className="dark:hover:bg-gray-700">
                {columns.map(({ key, render }, colIndex) => (
                  <td key={colIndex} className={classes}>
                    {render ? render(row) : row[key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
