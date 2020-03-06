import { parseTime } from "@/utils";
export default {
  methods: {
    sexFormat(row, column, cellValue) {
      return cellValue == 1 ? "男" : "女";
    },
    dateFormat(row, column, cellValue) {
      if (!cellValue) return "";
      return parseTime(cellValue, "{y}-{m}-{d} ");
    },
    dateYearFormat(row, column, cellValue) {
      if (!cellValue) return "";
      return parseTime(cellValue, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  }
};
