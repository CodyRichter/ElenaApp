import React, { useEffect } from "react";
import Autocomplete from "./AutoComplete";
import { FaSearch } from "react-icons/fa";
import { parseLocation } from "parse-address";
import qs from "qs";

const OsmAutocomplete = (props: any) => {
    useEffect(() => {
        const fetchInitialValue = async () => {
            const { initialInputValue, onSelectedItemChange } = props;
            if (initialInputValue && onSelectedItemChange) {
                const items = await fetchPlaces(initialInputValue);
                onSelectedItemChange({ selectedItem: items[0] });
            }
        };
        fetchInitialValue();
    }, []);

    return (
        <Autocomplete
            fetchItems={(inputValue: any) => fetchPlaces(inputValue)}
            getKey={({ properties: { place_id } }: any) => place_id}
            itemToString={({ properties: { display_name } }: any) =>
                display_name
            }
            renderInput={(props: any): any => <OsmInputBar {...props} />}
            renderItem={(props: any): any => <OsmOption {...props} />}
            {...props}
        />
    );
};

const fetchPlaces = async (query: any) => {
    const {
        number = "",
        prefix = "",
        street = "",
        suffix = "",
        type = "",
        city = "",
        state = "",
        zip = "",
    } = parseLocation(query) || {};
    const response = await fetch(
        `https://nominatim.openstreetmap.org/?${qs.stringify({
            street: [number, prefix, street, suffix, type].join(" "),
            city: city,
            state: state,
            postalcode: zip,
            building: "residential",
            addressdetails: 1,
            format: "geojson",
        })}`
    );
    const data = await response.json();
    return data.features;
};

const OsmInputBar = ({
    getInputProps,
    selectItem,
    closeMenu,
    inputValue,
}: any) => (
    <div className="field has-addons">
        <div className="control">
            <input {...getInputProps({ className: "input" })} />
        </div>
        <div className="control">
            <button
                className="button is-info"
                onClick={async () => {
                    const items = await fetchPlaces(inputValue);
                    selectItem(items[0]);
                    closeMenu();
                }}
            >
                <FaSearch />
            </button>
        </div>
    </div>
);

const OsmOption = ({
    properties: {
        address: {
            house_number = "",
            road = "",
            city = "",
            state = "",
            postcode = "",
        } = {},
    },
}) => (
    <span>
        <strong>
            {house_number} {road}
        </strong>
        {(house_number || road) && (city || state || postcode) && <br />}
        <em>
            {city}
            {city ? " " : ""}
            {state}
            {(city || state) && postcode ? ", " : ""}
            {postcode}
        </em>
    </span>
);

export default OsmAutocomplete;
