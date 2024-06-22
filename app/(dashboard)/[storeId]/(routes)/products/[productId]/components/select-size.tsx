import { SizeData } from "@/models/size.model";
import { useTheme } from "next-themes";
import ReactSelect, { MultiValue } from "react-select";

interface SelectSizeProps {
  disabled: boolean;
  options: SizeData[];
  onChange: (newValue: MultiValue<SizeData>) => void;
  value: SizeData[];
  label: string;
}

const SelectSize: React.FC<SelectSizeProps> = ({
  disabled,
  onChange,
  options,
  value,
  label,
}) => {
  const { theme } = useTheme();

  const mappedOptions = options.map((size) => ({
    value: size._id,
    label: size.name,
  }));

  const mappedValue = value.map((size) => ({
    value: size._id,
    label: size.name,
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#020E17",
      fontSize: "0.875rem",
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#020E17",
      color: "#8CA1BB",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#0D2136" : null,
      "&:hover": {
        backgroundColor: "#0D2136",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#06192A",
      color: "#e5e7eb",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#e5e7eb",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#e5e7eb",
      "&:hover": {
        backgroundColor: "#2C5282",
        color: "#e5e7eb",
      },
    }),
  };

  const lightStyles = {
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="z-10">
      <div className="mt-2 z-20">
        <ReactSelect
          isDisabled={disabled}
          value={mappedValue}
          onChange={(selected) => {
            const newValue = selected as MultiValue<{
              value: string;
              label: string;
            }>;
            onChange(
              newValue.map((item) => ({
                _id: item.value,
                name: item.label,
                value: "",
                storeId: "",
                colorId: "",
                createdAt: "",
              }))
            );
          }}
          placeholder={label}
          isMulti
          options={mappedOptions}
          styles={theme === "light" ? lightStyles : customStyles}
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );
};

export default SelectSize;
