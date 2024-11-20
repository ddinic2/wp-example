import * as React from "react";
import BookForm from "./BookForm";


interface AddNewBookProps {
    zanrovi: any[],
    authors:any[],
    allUsers:any[]
}

const AddNewBook = ({ zanrovi, authors, allUsers }: AddNewBookProps) => {


    return (
        <>
            <div>
                Add new book
            </div>
            <BookForm zanrovi={zanrovi} authors={authors} allUsers={allUsers} />
        </>
    )
}

export default AddNewBook
