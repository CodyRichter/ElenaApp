import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Dropdown from "./Dropdown";

const Autocomplete = ({
    fetchItems,
    delay = 300,
    onInputValueChange = () => {},
    ...props
}: any) => {
    const [items, setItems] = useState([]);
    const [delayedFetchItems] = useDebouncedCallback(async (inputValue) => {
        setItems(await fetchItems(inputValue));
    }, delay);

    return (
        <Dropdown
            items={items}
            onInputValueChange={async (changes: any) => {
                delayedFetchItems(changes.inputValue);
                onInputValueChange(changes);
            }}
            {...props}
        />
    );
};

export default Autocomplete;
