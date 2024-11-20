import * as React from "react"
import { IPersonaProps } from '@fluentui/react/lib/Persona'
import { CompactPeoplePicker, Label } from "office-ui-fabric-react"
import { IBasePicker } from "@fluentui/react";

interface Props {
    allUsers: IPersonaProps[];
    itemLimit: number;
    field: string;
    item: any;
    label: string;
    setItem: Function;
    // fastPreviewId: number;
    single: boolean;
}


const CustomPeoplePicker: React.FC<Props> = ({ allUsers, itemLimit, field, item, label, setItem, single }) => {

    const getSelected = () => {
        if (item[field] instanceof Array) {
            let tempUsers: any[] = []
            item[field].forEach((itId: number) => {
                let tempUser = allUsers.filter(us => Number(us.id) === itId)
                tempUsers = tempUsers.concat(tempUser)
            })
            return tempUsers
        } else {
            return allUsers.filter(u => u.id === item[field])
        }
    }

    const [mostRecentlyUsed, setMostRecentlyUsed] = React.useState<IPersonaProps[]>(allUsers.slice(0, 5));
    const [peopleList, setPeopleList] = React.useState<IPersonaProps[]>(allUsers);
    const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>(getSelected())
    const [localItem, setLocalItem] = React.useState(item)

    // React.useEffect(() => {
    //     console.log('selectedItems ', selectedItems)
    // }, [selectedItems])

    React.useEffect(() => {
        setLocalItem(item)
    }, [item])


    const onFilterChangedWithLimit = (
        filterText: string,
        currentPersonas: IPersonaProps[],
    ): IPersonaProps[] | Promise<IPersonaProps[]> => {
        return onFilterChanged(filterText, currentPersonas, 3);
    };

    const onFilterChanged = (
        filterText: string,
        currentPersonas: IPersonaProps[],
        limitResults?: number,
    ): IPersonaProps[] | Promise<IPersonaProps[]> => {
        if (filterText) {
            let filteredPersonas: IPersonaProps[] = filterPersonasByText(filterText);
            filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas);
            filteredPersonas = limitResults ? filteredPersonas.slice(0, limitResults) : filteredPersonas;
            return filterPromise(filteredPersonas);
        } else {
            return [];
        }
    };

    const filterPersonasByText = (filterText: string): IPersonaProps[] => {
        return peopleList.filter(pItem => doesTextStartWith(pItem.text as string, filterText));
    };

    function doesTextStartWith(text: string, filterText: string): boolean {
        return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
    }

    function removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
        if (personas) {
            return personas.filter(persona => !listContainsPersona(persona, possibleDupes));
        }
    }

    function listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
        if (!personas || !personas.length || personas.length === 0) {
            return false;
        }
        return personas.filter(pItem => pItem.text === persona.text).length > 0;
    }

    const filterPromise = (personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
        // if (delayResults) {
        //     return convertResultsToPromise(personasToReturn);
        // } else {
        return personasToReturn;
        //}
    };

    const returnMostRecentlyUsedWithLimit = (
        currentPersonas: IPersonaProps[],
    ): IPersonaProps[] | Promise<IPersonaProps[]> => {
        return filterPromise(removeDuplicates(mostRecentlyUsed, currentPersonas).slice(0, 3));
    };

    function getTextFromItem(persona: IPersonaProps): string {
        return persona.text as string;
    }

    const onRemoveSuggestion = (pItem: IPersonaProps): void => {
        const indexPeopleList: number = peopleList.indexOf(pItem);
        const indexMostRecentlyUsed: number = mostRecentlyUsed.indexOf(pItem);

        if (indexPeopleList >= 0) {
            const newPeople: IPersonaProps[] = peopleList
                .slice(0, indexPeopleList)
                .concat(peopleList.slice(indexPeopleList + 1));
            setPeopleList(newPeople);
        }

        if (indexMostRecentlyUsed >= 0) {
            const newSuggestedPeople: IPersonaProps[] = mostRecentlyUsed
                .slice(0, indexMostRecentlyUsed)
                .concat(mostRecentlyUsed.slice(indexMostRecentlyUsed + 1));
            setMostRecentlyUsed(newSuggestedPeople);
        }
    };

    const onItemsChange = React.useCallback(
        (items?: IPersonaProps[]) => {
            setSelectedItems(items ?? [])
            updateParentComponent(items)
        },
        [setSelectedItems, setLocalItem, localItem]
    )

    const updateParentComponent = (items: any) => {
        if (item[field] instanceof Array) {
            if (items.length) {
                setItem({ ...localItem, [field]: items.map((i: any) => { return i.id }) })
            } else {
                setItem({ ...localItem, [field]: single ? null : [] })
            }
        } else {
            if (items.length) {
                setItem({ ...localItem, [field]: items[0].id })
            } else {
                setItem({ ...localItem, [field]: single ? null : [] })
            }
        }
    }


    return (
        <>
            <Label required>{label}</Label>
            <CompactPeoplePicker
                onResolveSuggestions={onFilterChangedWithLimit}
                onEmptyInputFocus={returnMostRecentlyUsedWithLimit}
                getTextFromItem={getTextFromItem}
                onChange={onItemsChange}
                className={'ms-PeoplePicker'}
                onGetMoreResults={onFilterChanged}
                removeButtonAriaLabel={'Remove'}
                onRemoveSuggestion={onRemoveSuggestion}
                itemLimit={itemLimit}
                selectedItems={selectedItems}
                inputProps={{
                    // onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
                    // onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
                    'aria-label': 'People Picker',
                    required: true,
                }}
                resolveDelay={300}
                // disabled={fastPreviewId ? true : false}
            />
            {selectedItems.length === 0 &&
                <span>
                    <div aria-live="assertive" className="statusMessage-229"></div>
                    <div role="alert">
                        <p className="ms-TextField-errorMessage errorMessageCustom">
                            <span data-automation-id="error-message">Field is required</span>
                        </p>
                    </div>
                </span>
            }

        </>
    )
}

export default CustomPeoplePicker