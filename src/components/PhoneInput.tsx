import {
  getCountryCallingCode,
  getPhoneNumberLengthRange,
  getSupportedCountries,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "@/lib/phone-utils";
import { cn } from "@/lib/utils";
import { DownOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import * as React from "react";
import { CircleFlag } from "react-circle-flags";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  error?: boolean;
  defaultCountry?: string;
  isDisabledFlag?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onPhonePartsChange?: (value: {
    nationalNumber: string;
    callingCode: string;
  }) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value = "",
  onChange,
  disabled = false,
  className,
  placeholder = "Enter phone number",
  error,
  onBlur,
  onFocus,
  defaultCountry = "GB",
  isDisabledFlag = false,
  onPhonePartsChange,
}) => {
  const [country, setCountry] = React.useState<string>(
    value?.includes("+")
      ? parsePhoneNumber(value)?.country || ""
      : defaultCountry
  );
  const [phoneNumber, setPhoneNumber] = React.useState(
    value ? parsePhoneNumber(value)?.nationalNumber ?? "" : ""
  );

  const [isValid, setIsValid] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState("");

  // Get all countries with their calling codes
  const countries = React.useMemo(() => {
    return getSupportedCountries().map((code: string) => ({
      value: code,
      label: `+${getCountryCallingCode(code)}`,
      callingCode: getCountryCallingCode(code),
    }));
  }, []);

  // Filter countries based on search
  const filteredCountries = React.useMemo(() => {
    if (!searchValue) return countries;

    const searchLower = searchValue?.toLowerCase();
    return countries.filter((country) => {
      // Search by country code (e.g., 'FR', 'US')
      const codeMatch = country.value?.toLowerCase().includes(searchLower);
      // Search by calling code (e.g., '+33', '33')
      const callingCodeMatch =
        country.callingCode.toString().includes(searchLower) ||
        `+${country.callingCode}`.includes(searchLower);

      return codeMatch || callingCodeMatch;
    });
  }, [countries, searchValue]);

  // Handle country change
  const handleCountryChange = (option: { value: string }) => {
    setCountry(option.value);
    if (phoneNumber?.length > 0) {
      validatePhoneNumber(phoneNumber, option.value);
    }
  };

  // Handle phone number change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);
    validatePhoneNumber(newNumber, country);
  };

  // Validate phone number
  const validatePhoneNumber = (number: string, countryCode: string) => {
    const isValidNumber = isValidPhoneNumber(number, countryCode);
    setIsValid(isValidNumber);
    if (onChange) {
      if (number?.length > 1) {
        const parsed = parsePhoneNumber(number, countryCode);
        onChange(parsed?.number || "");

        if (parsed && onPhonePartsChange) {
          onPhonePartsChange({
            nationalNumber: parsed.nationalNumber || "",
            callingCode: String(getCountryCallingCode(countryCode)),
          });
        }
      } else {
        onChange(number.toString());
      }
    }
  };

  // Custom render for select option
  const renderCountryOption = (option: any) => {
    return (
      <div className="flex items-center gap-2">
        <CircleFlag
          countryCode={option.value?.toLowerCase()}
          width={20}
          height={20}
        />
        <span className="font-poppins text-[12px] text-black/85 opacity-80">
          {option?.value} (+{option?.data?.callingCode})
        </span>
      </div>
    );
  };

  // Custom dropdown render with search
  const dropdownRender = (menu: React.ReactElement) => (
    <div className="flex flex-col gap-1">
      <Input
        placeholder="Search country code or calling code..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full !border-none !focus:outline-none !focus:ring-0 !focus:border-none"
        allowClear
        style={{ border: "none", boxShadow: "none", outline: "none" }}
      />
      <div className="w-full border-t border-neutral-200">
        {filteredCountries.length > 0 ? (
          menu
        ) : (
          <div className="p-3 text-center text-gray-500 text-sm">
            No countries found
          </div>
        )}
      </div>
    </div>
  );

  const maxPhoneNumberLength = React.useMemo(() => {
    const range = getPhoneNumberLengthRange(country);
    return range ? range.length : 0;
  }, [country]);

  React.useEffect(() => {
    if (value === "" || value === undefined || value === null) {
      setPhoneNumber("");
      return;
    }
    if (value && value.startsWith("+")) {
      const parsed = parsePhoneNumber(value);
      if (parsed && parsed.nationalNumber) {
        setPhoneNumber(parsed.nationalNumber);
        if (parsed.country) {
          setCountry(parsed.country);
        }
      }
    }
  }, [value]);

  React.useEffect(() => {
    if (value && value.startsWith("+")) {
      const parsed = parsePhoneNumber(value);
      if (parsed?.nationalNumber) {
        setPhoneNumber(parsed.nationalNumber);
        if (parsed.country) {
          setCountry(parsed.country);
        }
      }
    }
  }, [value]);

  React.useEffect(() => {
    if (defaultCountry && !value) {
      setCountry(defaultCountry);
    }
  }, []);

  return (
    <div
      className={cn(
        "flex flex-row items-center bg-white rounded-[8px] h-[40px] box-border border border-[#D9D9D9]",
        error !== undefined
          ? error
          : !isValid
          ? "border-red-500"
          : "border-[#D9D9D9]",
        className
      )}
    >
      <div className=" h-full border-r border-[#D9D9D9] bg-[#FAFAFA] rounded-l-lg">
        <Select
          value={{ value: country }}
          onChange={handleCountryChange}
          prefix={
            country ? (
              <CircleFlag
                countryCode={country?.toLowerCase()}
                width={20}
                height={20}
              />
            ) : (
              <div className="w-5 h-5" />
            )
          }
          options={filteredCountries.map((c) => ({ ...c, key: c.value }))}
          popupMatchSelectWidth={220}
          variant="borderless"
          labelInValue
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
          }}
          className={cn(
            "h-full flex items-center px-3 [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:rounded-l-[8px]",
            disabled && "!bg-[#f0f0f0]"
          )}
          getPopupContainer={(trigger) => document.body}
          optionRender={renderCountryOption}
          suffixIcon={<DownOutlined className="text-[12px] text-black/25" />}
          dropdownAlign={{ points: ["tl", "bl"] }}
          popupRender={dropdownRender}
          disabled={isDisabledFlag}
        />
      </div>
      <div className="flex-1 h-full">
        <Input
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onKeyDown={(e) => {
            if (
              !/^[\d]$/.test(e.key) &&
              !e.ctrlKey &&
              !e.metaKey &&
              ![
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
              ].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
          variant="borderless"
          className={cn(
            "h-full font-poppins text-[16px] text-black/85 px-3 [&.ant-input]:!border-none [&.ant-input]:!outline-none [&.ant-input]:!shadow-none [&.ant-input]:rounded-r-[8px]",
            disabled && "!bg-[#f0f0f0]"
          )}
          style={{ border: "none", boxShadow: "none", outline: "none" }}
          maxLength={maxPhoneNumberLength}
        />
      </div>
    </div>
  );
};

export { PhoneInput };
