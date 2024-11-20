import * as React from "react";
import Service from "../services/Service";
import { DefaultButton, Overlay, PrimaryButton } from "office-ui-fabric-react";
import { useNavigate } from "react-router-dom";
import { FocusTrapZone, Popup, mergeStyleSets } from "@fluentui/react";

const popupStyles = mergeStyleSets({
    root: {
      background: 'rgba(0, 0, 0, 0.2)',
      bottom: '0',
      left: '0',
      position: 'fixed',
      right: '0',
      top: '0',
    },
    content: {
      background: 'white',
      left: '50%',
      maxWidth: '400px',
      padding: '0 2em 2em',
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  });

const BookList = () => {

    const svc = new Service
    const [books, setBooks] = React.useState([])
    let navigate = useNavigate()
    const [forDeleteId, setForDeleteId] = React.useState<number>()
    const [showDeleteDialog, setShowDeleteDialog] = React.useState<boolean>(false)


    React.useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const result = await svc.getFromList('Knjige', '')
        setBooks(result)
    }

    const editBook = (id: number) => {
        navigate(`/edit/${id}`)
    }

    const crateNew = () => {
        navigate(`/add-new`)
    }

    const callDeleteBook = (id: number) => {
        setForDeleteId(id)
        setShowDeleteDialog(true)
    }

    const deleteBook = async () => {
        const delRes = await svc.deleteItem('Knjige', forDeleteId)
        setShowDeleteDialog(false)
        setBooks(books.filter(b => b.Id != forDeleteId))
    }

    return (
        <>
            <div>
                <PrimaryButton text="Add new" onClick={() => { crateNew() }} />
            </div>
            <ul>
                {books.map((b) => {
                    return <li
                        style={{ margin: "15px" }}>{b.Title} - {b.Zanr}
                        <PrimaryButton style={{ float: "right" }} text="Edit" onClick={() => { editBook(b.Id) }} />
                        <PrimaryButton style={{ float: "right", marginRight: "20px" }} text="Delete" onClick={() => { callDeleteBook(b.Id) }} />
                    </li>
                })}
            </ul>

            {showDeleteDialog &&
                <Popup
                    className={popupStyles.root}
                    role="dialog"
                    aria-modal="true"
                    onDismiss={() => { setShowDeleteDialog(false) }}
                    enableAriaHiddenSiblings={true}
                >

                    <Overlay onClick={() => { setShowDeleteDialog(false) }} />

                    <FocusTrapZone>
                        <div role="document" className={popupStyles.content}>
                            <h2>Do you want delete book?</h2>
                            <p>

                            </p>
                            <PrimaryButton onClick={() => { deleteBook() }}>Delete</PrimaryButton>
                            <DefaultButton onClick={() => { setShowDeleteDialog(false) }}>Cancel</DefaultButton>
                        </div>
                    </FocusTrapZone>
                </Popup>
            }
        </>
    )
}

export default BookList;