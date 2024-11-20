import * as React from "react";
import { useParams } from "react-router-dom";
import Service from "../../services/Service";
import BookForm from "./BookForm";

interface EditBookProps {
    zanrovi: any[],
    authors: any[]
}

const EditBook = ({ zanrovi, authors }: EditBookProps) => {

    const svc = new Service
    let params = useParams()
    const [data, setData] = React.useState<any>()


    const id = Number(params.id)

    const getData = async () => {
        const result = await svc.getById('Knjige', id)
        if(result.Izdata){
            result.Izdata = new Date(result.Izdata)
        }
        setData(result)
    }

    React.useEffect(() => {
        if (id) {
            getData()
        }
    }, [id])


    return (
        <>
            <div>
                Edit book
            </div>
            {data && data.Id > 0 && <BookForm zanrovi={zanrovi} authors={authors} data={data} />}
            
        </>
    )
}

export default EditBook;