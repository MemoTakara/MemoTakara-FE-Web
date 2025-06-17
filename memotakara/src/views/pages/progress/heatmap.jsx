import { useState, useEffect } from "react";
import {
  Card,
  Select,
  Tooltip,
  Typography,
  Space,
  Spin,
  Row,
  Col,
  Statistic,
} from "antd";
import { CalendarOutlined, FireOutlined } from "@ant-design/icons";
import { getStudyHeatmap } from "@/api/progress";

const { Text } = Typography;
const { Option } = Select;

const StudyHeatmap = () => {
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({});

  // Mock API call - replace with actual API call
  // const fetchHeatmapData = async (year) => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const today = new Date();
  //       const startDate = new Date(today);
  //       startDate.setDate(today.getDate() - 2);
  //       const data = [];

  //       for (let i = 0; i < 3; i++) {
  //         const d = new Date(startDate);
  //         d.setDate(startDate.getDate() + i);
  //         const dateStr = d.toISOString().split("T")[0];
  //         const count = [20, 35, 15][i];
  //         data.push({ date: dateStr, count });
  //       }

  //       resolve({ success: true, data });
  //     }, 500);
  //   });
  // };
  // useEffect(() => {
  //   const loadHeatmapData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetchHeatmapData(selectedYear);
  //       setHeatmapData(response.data);

  //       const totalCards = response.data.reduce(
  //         (sum, day) => sum + day.count,
  //         0
  //       );
  //       const studyDays = response.data.filter((day) => day.count > 0).length;
  //       const maxDay = response.data.reduce(
  //         (max, day) => (day.count > max.count ? day : max),
  //         { count: 0 }
  //       );
  //       const avgPerDay =
  //         studyDays > 0 ? (totalCards / studyDays).toFixed(1) : 0;

  //       setStats({
  //         totalCards,
  //         studyDays,
  //         maxDay,
  //         avgPerDay,
  //         totalDays: 365,
  //       });
  //     } catch (error) {
  //       console.error("Error loading heatmap data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadHeatmapData();
  // }, [selectedYear]);
  useEffect(() => {
    const loadHeatmapData = async () => {
      setLoading(true);
      try {
        const data = await getStudyHeatmap(selectedYear); // GỌI API thật
        setHeatmapData(data);

        const totalCards = data.reduce((sum, day) => sum + day.count, 0);
        const studyDays = data.filter((day) => day.count > 0).length;
        const maxDay = data.reduce(
          (max, day) => (day.count > max.count ? day : max),
          { count: 0 }
        );
        const avgPerDay =
          studyDays > 0 ? (totalCards / studyDays).toFixed(1) : 0;

        setStats({
          totalCards,
          studyDays,
          maxDay,
          avgPerDay,
          totalDays: 365,
        });
      } catch (error) {
        console.error("Error loading heatmap data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHeatmapData();
  }, [selectedYear]);

  const getColorIntensity = (count) => {
    if (count === 0) return "#ebedf0";
    if (count <= 5) return "#9be9a8";
    if (count <= 15) return "#40c463";
    if (count <= 25) return "#30a14e";
    if (count <= 35) return "#216e39";
    return "#0d4429";
  };

  const getActivityLevel = (count) => {
    if (count === 0) return "No activity";
    if (count <= 5) return "Low activity";
    if (count <= 15) return "Medium activity";
    if (count <= 25) return "High activity";
    return "Very high activity";
  };

  const groupDataByWeeks = () => {
    const weeks = [];
    const dataMap = {};
    heatmapData.forEach((day) => {
      dataMap[day.date] = day.count;
    });

    const startDate = new Date(selectedYear, 0, 1);
    const firstDay = new Date(startDate);
    const dayOfWeek = firstDay.getDay();
    firstDay.setDate(firstDay.getDate() - dayOfWeek);

    let currentWeek = [];
    const endDate = new Date(selectedYear, 11, 31);

    for (
      let d = new Date(firstDay);
      d <= endDate || currentWeek.length > 0;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const count = dataMap[dateStr] || 0;
      const isInCurrentYear = d.getFullYear() === selectedYear;

      currentWeek.push({
        date: dateStr,
        count: isInCurrentYear ? count : 0,
        isInCurrentYear,
      });

      if (d.getDay() === 6 || d > endDate) {
        while (currentWeek.length < 7) {
          const nextDate = new Date(d);
          nextDate.setDate(nextDate.getDate() + (currentWeek.length - 6));
          currentWeek.push({
            date: nextDate.toISOString().split("T")[0],
            count: 0,
            isInCurrentYear: false,
          });
        }
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return weeks;
  };

  const weeks = groupDataByWeeks();
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Study Days"
              value={stats.studyDays}
              suffix={`/ ${stats.totalDays}`}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Best Day"
              value={stats.maxDay?.count || 0}
              suffix="cards"
              prefix={<FireOutlined />}
              valueStyle={{ color: "#fa541c" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Avg/Day"
              value={stats.avgPerDay}
              suffix="cards"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <CalendarOutlined />
            Study Activity Heatmap
          </Space>
        }
        extra={
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            style={{ width: 100 }}
          >
            {[2023, 2024, 2025].map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        }
      >
        <div style={{ overflowX: "auto", padding: "16px 0" }}>
          <div style={{ minWidth: "800px" }}>
            <div
              style={{
                display: "flex",
                marginBottom: "8px",
                paddingLeft: "32px",
              }}
            >
              {monthLabels.map((month, index) => (
                <div
                  key={month}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    fontSize: "12px",
                    color: "#666",
                    minWidth: "60px",
                  }}
                >
                  {month}
                </div>
              ))}
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ marginRight: "8px" }}>
                {dayLabels.map((day, index) => (
                  <div
                    key={day}
                    style={{
                      height: "12px",
                      marginBottom: "2px",
                      fontSize: "10px",
                      color: "#666",
                      display: "flex",
                      alignItems: "center",
                      width: "24px",
                    }}
                  >
                    {index % 2 === 1 ? day : ""}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "2px" }}>
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {week.map((day, dayIndex) => (
                      <Tooltip
                        key={`${weekIndex}-${dayIndex}`}
                        title={
                          day.isInCurrentYear ? (
                            <div>
                              <div>{day.count} cards studied</div>
                              <div>
                                {new Date(day.date).toLocaleDateString()}
                              </div>
                              <div>{getActivityLevel(day.count)}</div>
                            </div>
                          ) : null
                        }
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: day.isInCurrentYear
                              ? getColorIntensity(day.count)
                              : "#ebedf0",
                            borderRadius: "2px",
                            cursor: day.isInCurrentYear ? "pointer" : "default",
                            opacity: day.isInCurrentYear ? 1 : 0.3,
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              <span style={{ marginRight: "8px" }}>Less</span>
              <div style={{ display: "flex", gap: "2px", marginRight: "8px" }}>
                {[
                  "#ebedf0",
                  "#9be9a8",
                  "#40c463",
                  "#30a14e",
                  "#216e39",
                  "#0d4429",
                ].map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: color,
                      borderRadius: "2px",
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#fafafa",
            borderRadius: "6px",
          }}
        >
          <Text>
            <strong>{stats.studyDays}</strong> days of study activity in{" "}
            {selectedYear}
          </Text>
          {stats.maxDay?.count > 0 && (
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary">
                Most productive day: <strong>{stats.maxDay.count} cards</strong>
              </Text>
            </div>
          )}
          <div style={{ marginTop: "8px" }}>
            <Text type="secondary">
              Consistency rate:{" "}
              <strong>
                {((stats.studyDays / stats.totalDays) * 100).toFixed(1)}%
              </strong>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudyHeatmap;
