import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className='d-flex justify-content-end'>
            <Pagination>
                <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                {pageNumbers.map(page => (
                    <Pagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
                        {page}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    );
};

export default PaginationComponent;
