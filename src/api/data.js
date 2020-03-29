import request from "@/utils/request";

export function count() {
  return new Promise((resolve, reject) => {
    resolve({
      newVisits: 308,
      newIp: 224,
      recentVisits: 4827,
      recentIp: 3270
    });
  });
}

export function getChartData() {
  return new Promise((resolve, reject) => {
    resolve({
      weekDays: {
        0: "Mon",
        1: "Tue",
        2: "Wed",
        3: "Thu",
        4: "Fri",
        5: "Sat",
        6: "Sun"
      },
      visitsData: {
        0: 791,
        1: 836,
        2: 823,
        3: 820,
        4: 772,
        5: 477,
        6: 308
      },
      ipData: {
        0: 542,
        1: 525,
        2: 558,
        3: 572,
        4: 514,
        5: 335,
        6: 224
      }
    });
  });
}

export function get() {
  return new Promise((resolve, reject) => {
    resolve({
      newVisits: 308,
      newIp: 224,
      recentVisits: 4827,
      recentIp: 3270
    });
  });
}
