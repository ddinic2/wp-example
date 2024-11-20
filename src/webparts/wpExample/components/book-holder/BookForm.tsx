import * as React from "react";

import Service from "../../services/Service";
import { ComboBox, DatePicker, TextField, DayOfWeek, Checkbox, DefaultButton } from "office-ui-fabric-react";
import { defaultDatePickerStrings } from '@fluentui/react'
import { useNavigate } from "react-router-dom";
import CustomPeoplePicker from "./CustomPeoplePicker";

interface BookFormProp {
    data?: any;
    zanrovi: any[];
    authors: any[];
    allUsers: any[];
}


const BookForm = ({ zanrovi, authors, data, allUsers }: BookFormProp) => {

    const svc = new Service
    const [book, setBook] = React.useState(data || undefined)
    let navigate = useNavigate()

    const save = async () => {
        if (book?.Id) {
            const updateRes = await svc.updateItemInList('Knjige', { Id: book.Id, ID: book.ID, Title: book.Title, Zanr: book.Zanr, AuthorId: book.AutorId, Cena: book.Cena, Dostupna: book.Dostupna, Izdata: book.Izdata, OdgovorniId: book.OdgovorniId })
        } else {
            const saveRes = await svc.addInList('Knjige', book)
        }
        navigate(`/`)
    }

    return (
        <>
            <TextField label="Title"
                value={book?.Title} onChange={(e, v) => setBook({ ...book, Title: v })}
            />
            <ComboBox
                label="Zanr"
                options={zanrovi}
                autoComplete="on"
                onChange={(e, v) => setBook({ ...book, Zanr: v.key.toString() })}
                selectedKey={book?.Zanr}
            />
            <DatePicker
                firstDayOfWeek={DayOfWeek.Monday}
                showWeekNumbers={true}
                firstWeekOfYear={1}
                showMonthPickerAsOverlay={true}
                placeholder="Select a date..."
                label="Izdata"
                value={book?.Izdata}
                onSelectDate={(date) => setBook({ ...book, Izdata: date })}
                strings={defaultDatePickerStrings}
            />
            <TextField label="Cena:" type='number' underlined placeholder="Enter number" value={book && book.Cena ? book.Cena.toString() : ''} onChange={(e, v) => setBook({ ...book, Cena: Number(v) })} />

            <Checkbox label="Dostupna" checked={book?.Dostupna} onChange={(e, v) => setBook({ ...book, Dostupna: v })} />

            <ComboBox
                label="Autor"
                options={authors}
                autoComplete="on"
                onChange={(e, v) => setBook({ ...book, AutorId: v.key })}
                selectedKey={book?.AutorId}
            />

            {allUsers.length > 0 && <CustomPeoplePicker allUsers={allUsers} itemLimit={2} field={'OdgovorniId'} item={book} label="Odgovorni" setItem={setBook} single={false}></CustomPeoplePicker>} 

            <DefaultButton text="Save" onClick={() => { save() }} />
        </>
    )
}

export default BookForm
