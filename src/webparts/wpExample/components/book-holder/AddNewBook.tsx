import * as React from "react";
import BookForm from "./BookForm";


interface AddNewBookProps {
    zanrovi: any[],
    authors:any[]
}

const AddNewBook = ({ zanrovi, authors }: AddNewBookProps) => {


    return (
        <>
            <div>
                Add new book
            </div>
            <BookForm zanrovi={zanrovi} authors={authors} />
        </>
    )
}

export default AddNewBook
