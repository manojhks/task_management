import React from 'react';

export const Pagination = ({ currentPage, itemsPerPage, totalItems, handlePageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className='pagination-div'>
            <button
                className='pagination-arrow'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            <span> &nbsp;{currentPage} of {totalPages} &nbsp;</span>
            <button
                className='pagination-arrow'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};