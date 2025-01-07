import * as Select from "@radix-ui/react-select";
import {
  CheckCircledIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

const TokenSelect = ({ tokens, value, onChange, disabled }) => {
  return (
    <Select.Root onValueChange={onChange} value={value} disabled={disabled}>
      <Select.Trigger className="flex items-center justify-between bg-gray-800 gap-1 p-2 outline-0 border-0">
        <div className="flex gap-2 items-center">
          {value && <img src={getTokenIconSrc(value)} />}
          <Select.Value placeholder="Select token" />
        </div>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-gray-900 rounded-lg overflow-hidden">
          <Select.ScrollUpButton className="flex items-center justify-center bg-gray-800/75 p-1 shadow-lg">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2 w-[160px] max-w-[200px]">
            {tokens?.map(({ currency }) => (
              <SelectItem
                key={currency}
                value={currency}
                selected={value === currency}
              >
                {currency}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center bg-gray-800/75 p-1 shadow-lg">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = ({
  children,
  className = "",
  value,
  selected,
  ...props
}) => {
  return (
    <Select.Item
      className={`flex items-center justify-between p-2 hover:bg-gray-800 gap-4 hover:outline-0 rounded-lg ${className} ${selected ? "bg-gray-800/75" : ""}`}
      value={value}
      {...props}
    >
      <div className="flex gap-2 items-center">
        <img src={getTokenIconSrc(value)} />
        <Select.ItemText>{children}</Select.ItemText>
      </div>
      <Select.ItemIndicator className="">
        <CheckCircledIcon color="#10b981" />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

const getTokenIconSrc = (token) =>
  `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;

export default TokenSelect;
