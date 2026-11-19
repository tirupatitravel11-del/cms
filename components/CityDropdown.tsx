import axios from "axios";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
} from "@mui/material";

export default function CityDropdown({
  value,
  onChange,
}: any) {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCities(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchCities = async (keyword: string) => {
    try {
      setLoading(true);

      const baseUrl = process.env.apiUrl || "http://localhost:8000";
      const res = await axios.post(
        `${baseUrl}/api/dropdown-cabhub-city`,
        {
          search: keyword,
        }
      );
      setOptions(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      options={options}
      value={value || null}
      loading={loading}
      freeSolo={false}
      getOptionLabel={(option: any) => {
        if (!option) return "";
        if (typeof option === "string") return option;
        return option.cityName || "";
      }}
      isOptionEqualToValue={(option: any, val: any) => {
        if (!option || !val) return false;
        return option._id === val._id;
      }}
      onInputChange={(e, newInputValue, reason) => {
        if (reason === "input") {
          setSearch(newInputValue);
        } else if (reason === "clear") {
          setSearch("");
        }
      }}
      onChange={(e, selectedOption) => onChange(selectedOption)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select City"
          placeholder="Search City"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}