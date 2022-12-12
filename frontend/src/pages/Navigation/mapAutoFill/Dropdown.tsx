import React from "react";
import { useCombobox } from "downshift";

const Dropdown = ({
    renderInput,
    renderItem,
    getKey = ({ id }: any) => id,
    ...props
}: any) => {
    const { getComboboxProps, getItemProps, getMenuProps, ...combobox } =
        useCombobox(props);

    return (
        <div
            className={`dropdown ${
                props.items.length && combobox.isOpen ? "is-active" : ""
            }`}
        >
            <div
                {...getComboboxProps({
                    className: "dropdown-trigger",
                })}
            >
                {renderInput({ items: props.items, ...combobox })}
            </div>
            <div
                {...getMenuProps({
                    className: "dropdown-menu",
                })}
            >
                <div className="dropdown-content">
                    {props.items.map((item: any, index: any) => (
                        <div
                            key={getKey(item)}
                            {...getItemProps({
                                item,
                                index,
                                className: "dropdown-item",
                            })}
                        >
                            {renderItem(item)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
