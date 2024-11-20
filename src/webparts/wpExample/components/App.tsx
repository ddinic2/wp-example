import * as React from 'react'
import { Routes, Route, HashRouter, json } from "react-router-dom";
import Service from '../services/Service';
import BookList from './BookList';
import AddNewBook from './book-holder/AddNewBook';
import EditBook from './book-holder/EditBook';

const App = ({ context }: any) => {

    const svc = new Service
    const [zanrovi, setZanr] = React.useState([])
    const [authors, setAuthors] = React.useState([])
    const [allUsers, setAllUsers] = React.useState([])

    React.useEffect(()=>{
        getData()
    },[])

    const getData = async () =>{
        const res = await svc.getChoices('Knjige', 'Zanr')
        setZanr(svc.makeDropdownFluentFromChoices(res.Choices, true))
        const authRes = await svc.getFromList('Autori', '')
        setAuthors(svc.makeDropdown(authRes))
        const userRes = await svc.getAllUsers()
        const personas = userRes.map((user: any) => ({
            id: user.Id,
            text: user.Title,
            email: user.Email,
            jobTitle: user.JobTitle,
            photoUrl: user.PictureUrl
        }));
        setAllUsers(personas)
        console.log('user list', personas)
    }



    return (
        <>
            <div className="container-fluid">
                {/* {loader ? <Loader /> : */}
                
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<BookList/>}></Route>
                            <Route path='/add-new' element={<AddNewBook zanrovi={zanrovi} authors={authors} allUsers={allUsers}/>}></Route>
                            <Route path="/edit/:id" element={<EditBook zanrovi={zanrovi} authors={authors} allUsers={allUsers}/>}></Route>
                            <Route path="*" element={
                                <main style={{ padding: "1rem" }}>
                                    <p>There's nothing here!</p>
                                </main>
                            }
                            >
                            </Route>
                        </Routes>
                    </HashRouter>
                {/* } */}
            </div>

        </>

    )
}

export default App;