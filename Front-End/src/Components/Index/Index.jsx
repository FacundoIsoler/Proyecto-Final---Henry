import React from "react";
import s from './index.module.css';



export default function Paginado({ servicesPerPage, allServices, index, currentPage }) {
    const pageNumber = [];

    function nextPrevButton(e) {
        if (e.target.value === "prev" && currentPage > 1) {
            index(currentPage - 1)
        } else if (e.target.value === "next" && currentPage < pageNumber.length) {
            index(currentPage + 1)
        }
    }

    for (let i = 0; i < Math.ceil(allServices / servicesPerPage); i++) {
        pageNumber.push(i + 1)
    }

    let barSize = [...pageNumber];
    if(pageNumber.length > 5){
        barSize = barSize.slice(2, pageNumber.length-2);
    }
    console.log(barSize, "BARSIZE")
    console.log(pageNumber.length)

    return (
        <div>
            <div className={s.pagination}>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <button className={`page-link ${s.buttons}`} onClick={(e) => nextPrevButton(e)} value="prev">Anterior</button>
                        {pageNumber &&
                            pageNumber.map(number => {
                                return <>
                                {pageNumber.length < 5 ? <li className="page-item" ><p className={ currentPage === number ? `page-link ${s.activePage}` : `page-link ${s.focusPage}`} key={number} value={number}
                                    onClick={() => index(number)}> {number}</p></li> : null}

                                {pageNumber.length > 5 && number < 3 ? <li className="page-item" ><p className={ currentPage === number ? `page-link ${s.activePage}` : `page-link ${s.focusPage}`} key={number} value={number}
                                    onClick={() => index(number)}> {number}</p></li> : null}
                                    
                                    {pageNumber.length > 5 && number === 2 ? 
                                    <>
                                    <li className="page-item" ><p className={ `page-link`} key={number} value={number}
                                     >...</p></li>
                                    {currentPage > 2 && currentPage < pageNumber.length -1 ? <li className="page-item" ><p className={ currentPage === number ? `page-link ${s.activePage}` : `page-link ${s.focusPage}`} key={number} value={number}
                                    onClick={() => index(currentPage)}> {currentPage}</p></li> : null }
                                    </> : null}

                                    {/* {pageNumber.length > 5 && number > 1 && number < pageNumber.length - 1 ? <li className="page-item" ><p className={ currentPage === number ? `page-link ${s.activePage}` : `page-link ${s.focusPage}`} key={number} value={number}
                                    onClick={() => index(number)}> {number}</p></li>: null } */}
                                    

                                    {pageNumber.length > 5 && number === pageNumber.length - 1 ? <li className="page-item" ><p className={ `page-link`} key={number} value={number}
                                        >...</p></li> : null}
                        
                                    {pageNumber.length > 5 && number > pageNumber.length - 2 ? <li className="page-item" ><p className={ currentPage === number ? `page-link ${s.activePage}` : `page-link ${s.focusPage}`} key={number} value={number}
                                    onClick={() => index(number)}> {number}</p></li> : null}
                                    </>

                                } 
                            )}
                            {/* <li className="page-item" ><p className="page-link" key={number} value={number}
                                    onClick={() => index(number)}> {number}</p></li> */}
                        <button className={`page-link ${s.buttons}`} onClick={(e) => nextPrevButton(e)} value="next">Siguiente</button>
                    </ul>
                </nav >
            </div>
        </div>

    )
}