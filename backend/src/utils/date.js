export const getDateRange = ({ from, to, period }) => {
  const now = new Date();
  let start = from ? new Date(from) : null;
  let end = to ? new Date(to) : null;

  if (!start && period) {
    start = new Date(now);

    if (period === "week") {
      start.setDate(now.getDate() - 7);
    } else if (period === "month") {
      start.setMonth(now.getMonth() - 1);
    } else if (period === "year") {
      start.setFullYear(now.getFullYear() - 1);
    }
  }

  if (!end) {
    end = now;
  }

  return {
    start,
    end
  };
};
