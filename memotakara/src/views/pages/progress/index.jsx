import "./index.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Select,
  Table,
  Tag,
  Typography,
  Avatar,
  List,
  Badge,
  Space,
} from "antd";
import {
  FireOutlined,
  BookOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CheckCircleOutlined,
  UserOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import StudyHeatmap from "@/views/pages/progress/heatmap";
import { getDashboard, getAnalytics, getLeaderboard } from "@/api/progress";
import { data } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const ProgressPage = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  // const [leaderboardData, setLeaderboardData] = useState({
  //   current_user_rank: {
  //     rank: 12,
  //     total_users: 1500,
  //     cards_studied: 315,
  //   },
  //   leaderboard: [
  //     {
  //       name: "Alice Chen",
  //       cards_studied: 890,
  //       userLevel: { title: "Expert", level: 15 },
  //     },
  //     {
  //       name: "Bob Smith",
  //       cards_studied: 756,
  //       userLevel: { title: "Advanced", level: 12 },
  //     },
  //     {
  //       name: "Carol Wang",
  //       cards_studied: 623,
  //       userLevel: { title: "Advanced", level: 10 },
  //     },
  //     {
  //       name: "David Lee",
  //       cards_studied: 589,
  //       userLevel: { title: "Intermediate", level: 8 },
  //     },
  //     {
  //       name: "Eva Brown",
  //       cards_studied: 445,
  //       userLevel: { title: "Intermediate", level: 6 },
  //     },
  //   ],
  // });
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [analyticsDays, setAnalyticsDays] = useState(30);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboardData(res);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  const fetchAnalytics = async (days) => {
    try {
      const res = await getAnalytics(days);
      setAnalyticsData(res);
    } catch (err) {
      console.error("Failed to fetch analytics data", err);
    }
  };

  const fetchLeaderboard = async (period) => {
    try {
      const res = await getLeaderboard(period);
      setLeaderboardData(res);
    } catch (err) {
      console.error("Failed to fetch leaderboard data", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    fetchAnalytics(analyticsDays);
  }, [analyticsDays]);

  useEffect(() => {
    fetchLeaderboard(selectedPeriod);
  }, [selectedPeriod]);

  const stats = dashboardData?.overall_stats || {};

  const pieData = [
    {
      name: t("views.pages.progress.new"),
      value: stats.new_cards,
      color: "#1890ff",
    },
    {
      name: t("views.pages.progress.learning"),
      value: stats.learning_cards,
      color: "#fa8c16",
    },
    {
      name: t("views.pages.progress.review"),
      value: stats.review_cards,
      color: "#722ed1",
    },
    {
      name: t("views.pages.progress.mastered"),
      value: stats.mastered_cards,
      color: "#52c41a",
    },
    {
      name: t("views.pages.progress.due"),
      value: stats.due_cards,
      color: "#f5222d",
    },
  ];

  return (
    <div className="progress-container">
      {/* Today's Key Stats */}
      <div className="progress-section">
        <div className="progress-section-title">
          {t("views.pages.progress.today-performance")}
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("views.pages.progress.study-time")}
                value={dashboardData?.today_stats.study_time_minutes}
                suffix={t("views.pages.progress.min")}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("views.pages.progress.sessions")}
                value={dashboardData?.today_stats.sessions_count}
                prefix={<BookOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("views.pages.progress.cards-studied")}
                value={dashboardData?.today_stats.cards_studied}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("views.pages.progress.study-streak")}
                value={dashboardData?.overall_stats.study_streak}
                suffix={t("views.pages.progress.days")}
                prefix={<FireOutlined />}
                valueStyle={{ color: "#fa541c" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Daily Goal Progress */}
      <div className="progress-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title={t("views.pages.progress.daily-goal-progress")}>
              <Progress
                percent={
                  dashboardData?.today_stats.goal_progress.progress_percentage
                }
                status={
                  dashboardData?.today_stats.goal_progress.goal_achieved
                    ? "success"
                    : "active"
                }
                strokeColor={
                  dashboardData?.today_stats.goal_progress.goal_achieved
                    ? "#52c41a"
                    : "#1890ff"
                }
              />
              <div style={{ marginTop: 16 }}>
                <Text>
                  {dashboardData?.today_stats.goal_progress.cards_studied} /{" "}
                  {dashboardData?.today_stats.goal_progress.daily_goal}{" "}
                  {t("views.pages.study_sets.cards")}
                </Text>
                {dashboardData?.today_stats.goal_progress.goal_achieved && (
                  <Tag color="success" style={{ marginLeft: 8 }}>
                    {t("views.pages.progress.goal-achieved")}
                  </Tag>
                )}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title={t("views.pages.progress.weekly-progress")}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title={t("views.pages.progress.this-week")}
                    value={dashboardData?.weekly_comparison.this_week}
                    suffix={t("views.pages.study_sets.cards")}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={t("views.pages.progress.change")}
                    value={dashboardData?.weekly_comparison.change_percentage}
                    precision={1}
                    suffix="%"
                    valueStyle={{
                      color:
                        dashboardData?.weekly_comparison.change_percentage >= 0
                          ? "#3f8600"
                          : "#cf1322",
                    }}
                    prefix={
                      dashboardData?.weekly_comparison.change_percentage >= 0
                        ? "↗"
                        : "↘"
                    }
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Cards Overview */}
      <div className="progress-section">
        <div className="progress-section-title">
          {t("views.pages.progress.cards-overview")}
        </div>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card style={{ height: "100%", alignContent: "center" }}>
              {[
                {
                  title: t("views.pages.progress.total"),
                  value: stats.total_cards,
                },
                {
                  title: t("views.pages.progress.new"),
                  value: stats.new_cards,
                  color: "#1890ff",
                },
                {
                  title: t("views.pages.progress.learning"),
                  value: stats.learning_cards,
                  color: "#fa8c16",
                },
                {
                  title: t("views.pages.progress.review"),
                  value: stats.review_cards,
                  color: "#722ed1",
                },
                {
                  title: t("views.pages.progress.mastered"),
                  value: stats.mastered_cards,
                  color: "#52c41a",
                },
                {
                  title: t("views.pages.progress.due"),
                  value: stats.due_cards,
                  color: "#f5222d",
                },
              ].map(({ title, value, color }, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    fontSize: "16px",
                  }}
                >
                  <div style={{ width: "50%", textAlign: "left" }}>{title}</div>
                  <div
                    style={{
                      width: "50%",
                      textAlign: "right",
                      fontWeight: 500,
                      color: color || "inherit",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card style={{ height: "100%" }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Study Time Trend */}
      {/* <div className="progress-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="progress-section-title">
            {t("views.pages.progress.study-analytics")}
          </div>
          <Select
            value={analyticsDays}
            onChange={setAnalyticsDays}
            style={{ width: 120 }}
          >
            <Option value={7}>7 days</Option>
            <Option value={30}>30 days</Option>
            <Option value={90}>90 days</Option>
          </Select>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title={t("views.pages.progress.peak-hour")}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(
                    analyticsData?.peak_study_hours || {}
                  ).map(([hour, count]) => ({ hour: `${hour}:00`, count }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={t("views.pages.progress.hour")} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar
                    dataKey={t("views.pages.progress.count")}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title={t("views.pages.progress.accuracy-trend")}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData?.accuracy_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={t("views.pages.progress.date")} />
                  <YAxis />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey={t("views.pages.progress.accuracy")}
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name={t("views.pages.progress.Accuracy")}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div> */}

      {/* Collection Performance Table */}
      <div className="progress-section">
        <div className="progress-section-title">
          {t("views.pages.progress.collection-performance")}
        </div>
        <Card>
          <Table
            dataSource={analyticsData?.collection_performance}
            columns={[
              {
                title: t("views.pages.progress.collection"),
                dataIndex: "collection_name",
                key: "collection_name",
              },
              {
                title: t("views.pages.progress.cards-studied"),
                dataIndex: "total_cards",
                key: "total_cards",
                sorter: (a, b) => a.total_cards - b.total_cards,
              },
              {
                title: t("views.pages.progress.accuracy-capitalize"),
                dataIndex: "accuracy",
                key: "accuracy",
                render: (accuracy) => `${accuracy}%`,
                sorter: (a, b) => a.accuracy - b.accuracy,
              },
              {
                title: t("views.pages.progress.total-time"),
                dataIndex: "total_time",
                key: "total_time",
                render: (time) =>
                  `${time} ${t("views.pages.progress.min-mini")}`,
                sorter: (a, b) => a.total_time - b.total_time,
              },
              {
                title: t("views.pages.progress.sessions"),
                dataIndex: "sessions_count",
                key: "sessions_count",
                sorter: (a, b) => a.sessions_count - b.sessions_count,
              },
            ]}
            pagination={false}
            size="small"
          />
        </Card>
      </div>

      {/* Additional Analytics Stats */}
      <div className="progress-section">
        <div className="progress-section-title">
          {t("views.pages.progress.performance-metrics")}
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("views.pages.progress.average-quality")}
                value={analyticsData?.difficulty_analysis.average_quality}
                precision={2}
                prefix={<StarOutlined />}
                suffix="/ 5"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("views.pages.progress.success-rate")}
                value={analyticsData?.difficulty_analysis.success_rate}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title={t("views.pages.progress.retention-rate")}
                value={analyticsData?.retention_rate.retention_rate}
                suffix="%"
                precision={1}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Study Heatmap */}
      <div className="progress-section">
        <div className="progress-section-title">
          {t("views.pages.progress.study-heatmap")}
        </div>
        {/* <Card>
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Study activity over time</Text>
          </div>
          <StudyHeatmap />
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Less
            </Text>
            <div style={{ display: "flex", gap: "2px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "2px",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#faad14",
                  borderRadius: "2px",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#52c41a",
                  borderRadius: "2px",
                }}
              />
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              More
            </Text>
          </div>
        </Card> */}
        <StudyHeatmap />
      </div>

      {/* Learderboard */}
      {/* <div className="progress-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div className="progress-section-title">
            {t("views.pages.progress.learderboard")}
          </div>
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            style={{ width: 120 }}
          >
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="all_time">All Time</Option>
          </Select>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card title="Your Rank">
              <div style={{ textAlign: "center" }}>
                <Avatar size={64} style={{ backgroundColor: "#1890ff" }}>
                  {leaderboardData?.current_user_rank.rank}
                </Avatar>
                <Title level={3} style={{ margin: "16px 0 8px" }}>
                  #{leaderboardData?.current_user_rank.rank}
                </Title>
                <Text type="secondary">
                  out of {leaderboardData?.current_user_rank.total_users} users
                </Text>
                <div style={{ marginTop: 16 }}>
                  <Statistic
                    title="Your Cards Studied"
                    value={leaderboardData?.current_user_rank.cards_studied}
                    prefix={<BookOutlined />}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={16}>
            <Card title="Top Learners">
              <List
                dataSource={leaderboardData?.leaderboard}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Badge
                          count={index + 1}
                          color={index < 3 ? "gold" : "default"}
                        >
                          <Avatar icon={<UserOutlined />} />
                        </Badge>
                      }
                      title={
                        <Space>
                          {item.name}
                          <Tag
                            color={
                              item.userLevel?.level >= 10 ? "gold" : "blue"
                            }
                          >
                            {item.userLevel?.title}
                          </Tag>
                        </Space>
                      }
                      description={`${item.cards_studied} cards studied`}
                    />
                    {index < 3 && (
                      <TrophyOutlined
                        style={{
                          color:
                            index === 0
                              ? "#gold"
                              : index === 1
                              ? "#silver"
                              : "#cd7f32",
                          fontSize: 24,
                        }}
                      />
                    )}
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div> */}
    </div>
  );
};

export default ProgressPage;
