import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-full px-4 py-2 rounded-sm text-base ${
            i === currentPage
              ? 'dark:bg-gray-600 bg-gray-800 text-white dark:hover:bg-gray-700 hover:bg-gray-500'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-full p-4 border text-base rounded-l-xl rounded-sm text-gray-600 bg-white hover:bg-gray-100"
      >
        <svg
          width="9"
          fill="currentColor"
          height="8"
          viewBox="0 0 1792 1792"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
        </svg>
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-full p-4 border text-base rounded-r-xl rounded-sm text-gray-600 bg-white hover:bg-gray-100"
      >
        <svg
          width="9"
          fill="currentColor"
          height="8"
          viewBox="0 0 1792 1792"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
        </svg>
      </button>
    </div>
  );
}
