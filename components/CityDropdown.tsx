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

      const res = await axios.post(
        `${process.env.apiUrl}/api/dropdown-cabhub-city`,
        {
search:keyword
        }
      );
console.log("sdf")
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
      value={value}
      loading={loading}
      freeSolo={false}
      getOptionLabel={(option: any) => option.cityName || ""}
      isOptionEqualToValue={(option: any, value: any) =>
        option._id === value._id
      }
      onInputChange={(e, value) => setSearch(value)}
      onChange={(e, value) => onChange(value)}
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