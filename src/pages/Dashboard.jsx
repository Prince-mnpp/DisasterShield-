import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/ui_design/Sidebar";
import NavBar from "../components/ui_design/NavBar";
import RiskCard from "../components/ui_design/RiskCard";
import AlertBanner from "../components/ui_design/AlertBanner";
import GovernmentPanel from "../components/ui_design/GovernmentPanel";
import AnalyticsChart from "../components/ui_design/AnalyticsChart";
import MapPanel from "../components/ui_design/MapPanel";
import { supabase } from "../lib/supabase";

function calculateRiskScore({
  rainfall,
  riverLevel,
  reportCount,
  historicalFrequency,
  reportImpact = 0,
}) {
  let score = 0;

  if (rainfall > 150) score += 30;
  else if (rainfall > 100) score += 20;
  else if (rainfall > 50) score += 10;

  if (riverLevel > 8) score += 30;
  else if (riverLevel > 6) score += 20;
  else if (riverLevel > 4) score += 10;

  if (reportCount > 20) score += 20;
  else if (reportCount > 10) score += 10;
  else if (reportCount > 5) score += 5;

  if (historicalFrequency > 3) score += 20;
  else if (historicalFrequency > 1) score += 10;

  score += reportImpact;

  return Math.min(score, 100);
}

function getRiskLevel(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function getReportImpact(reports) {
  let extraScore = 0;

  reports.forEach((report) => {
    const severity = String(report.severity || "").toLowerCase();
    const type = String(
      report.disaster_type || report.report_type || report.type || ""
    ).toLowerCase();
    const desc = String(report.description || report.message || "").toLowerCase();
    const peopleAffected = Number(report.people_affected || report.peopleAffected || 0);

    if (severity === "high") extraScore += 12;
    else if (severity === "medium") extraScore += 7;
    else if (severity === "low") extraScore += 3;

    if (type.includes("flood")) extraScore += 10;
    if (type.includes("waterlogging")) extraScore += 6;
    if (type.includes("landslide")) extraScore += 12;
    if (type.includes("road")) extraScore += 8;
    if (type.includes("medical")) extraScore += 10;
    if (type.includes("fire")) extraScore += 15;
    if (type.includes("storm")) extraScore += 8;

    if (desc.includes("trapped")) extraScore += 12;
    if (desc.includes("rescue")) extraScore += 10;
    if (desc.includes("collapsed")) extraScore += 15;
    if (desc.includes("injured")) extraScore += 8;
    if (desc.includes("severe")) extraScore += 5;
    if (desc.includes("urgent")) extraScore += 8;

    if (peopleAffected >= 20) extraScore += 10;
    else if (peopleAffected >= 10) extraScore += 6;
    else if (peopleAffected >= 5) extraScore += 3;
  });

  return Math.min(extraScore, 40);
}

function getRecommendations(score, riverLevel, resources, reports = []) {
  const actions = [];

  if (score >= 80) {
    actions.push("Deploy rescue teams immediately");
    actions.push("Start evacuation in affected areas");
    actions.push("Open emergency shelters");
    actions.push("Provide food, water, and medical aid");
  } else if (score >= 60) {
    actions.push("Keep emergency teams on standby");
    actions.push("Alert district authorities");
    actions.push("Prepare shelter and transport support");
  } else if (score >= 40) {
    actions.push("Increase field monitoring");
  } else {
    actions.push("Continue routine monitoring");
  }

  if (riverLevel > 8) {
    actions.push("Monitor river banks and embankments continuously");
  }

  const hasMedical = reports.some((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("medical")
  );

  const hasFlood = reports.some((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("flood")
  );

  const hasRoadBlock = reports.some((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("road")
  );

  const hasTrapped = reports.some((r) =>
    `${r.description || r.message || ""}`.toLowerCase().includes("trapped")
  );

  const hasFire = reports.some((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("fire")
  );

  if (hasMedical) actions.push("Dispatch medical response teams immediately");
  if (hasFlood) actions.push("Place boats and flood rescue units on standby");
  if (hasRoadBlock) actions.push("Send road clearance teams and publish alternate routes");
  if (hasTrapped) actions.push("Prioritize rescue operations for trapped citizens");
  if (hasFire) actions.push("Deploy fire and emergency control teams");

  if (!resources.vehicle && score >= 60) {
    actions.push("Arrange external transport support");
  }

  if (!resources.shelterAccess && score >= 60) {
    actions.push("Share nearest shelter details with citizens");
  }

  if (resources.elderlyAtHome && score >= 60) {
    actions.push("Prioritize assisted evacuation for elderly residents");
  }

  return [...new Set(actions)];
}

function getCitizenAdvice(score, riverLevel, rainfall, reportCount, resources, reports = []) {
  const advice = [];

  if (rainfall > 100) {
    advice.push("Heavy rainfall detected. Avoid unnecessary outdoor movement.");
  }

  if (riverLevel > 8) {
    advice.push("River level is critical. Stay away from banks and low-lying roads.");
  }

  if (reportCount > 10) {
    advice.push("Multiple distress reports detected. Follow official updates closely.");
  }

  const hasFlood = reports.some((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("flood")
  );

  const hasWaterlogging = reports.some((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("waterlogging")
  );

  const hasRoadBlock = reports.some((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("road")
  );

  const hasMedical = reports.some((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("medical")
  );

  const hasTrapped = reports.some((r) =>
    `${r.description || r.message || ""}`.toLowerCase().includes("trapped")
  );

  if (hasFlood) advice.push("Avoid flood-prone roads and move valuables to higher places.");
  if (hasWaterlogging) advice.push("Avoid waterlogged streets and use safer alternate routes.");
  if (hasRoadBlock) advice.push("Road blockages reported. Check local route updates before travel.");
  if (hasMedical) advice.push("Keep emergency medical contacts ready and assist vulnerable people nearby.");
  if (hasTrapped) advice.push("Do not enter dangerous zones; contact rescue authorities immediately.");

  if (score >= 80) {
    advice.push("Evacuate immediately from high-risk zones.");
    advice.push("Move to the nearest safe shelter.");
  } else if (score >= 60) {
    advice.push("Keep emergency kits, medicines, and documents ready.");
    advice.push("Prepare for possible evacuation.");
  } else if (score >= 40) {
    advice.push("Stay alert and monitor updates regularly.");
  } else {
    advice.push("Conditions are currently stable. Continue monitoring.");
  }

  if (!resources.drinkingWater) advice.push("Store clean drinking water immediately.");
  if (!resources.foodStock) advice.push("Keep dry food stock for at least 24 hours.");
  if (!resources.flashlight) advice.push("Arrange a torch or emergency light in case of power cuts.");
  if (!resources.powerBank) advice.push("Charge all devices and arrange backup power.");
  if (!resources.firstAid) advice.push("Keep a first aid kit ready as soon as possible.");
  if (!resources.medicines) advice.push("Keep essential medicines ready before conditions worsen.");

  if (!resources.vehicle && score >= 60) {
    advice.push("Arrange transport early because evacuation may become difficult.");
  }

  if (resources.elderlyAtHome) {
    advice.push("Prepare special assistance for elderly family members.");
  }

  return [...new Set(advice)];
}

function getResourceGaps(score, resources) {
  const gaps = [];

  if (score >= 60 && !resources.vehicle) gaps.push("Transport unavailable for fast evacuation");
  if (!resources.firstAid) gaps.push("Medical readiness is low");
  if (!resources.drinkingWater) gaps.push("Safe drinking water is insufficient");
  if (!resources.foodStock) gaps.push("Emergency food stock is unavailable");
  if (!resources.flashlight) gaps.push("Emergency lighting is unavailable");
  if (!resources.powerBank) gaps.push("Backup power is missing");
  if (!resources.shelterAccess && score >= 60) gaps.push("Nearest shelter access is not known");
  if (!resources.mobileNetwork && score >= 60) gaps.push("Communication network is weak or unavailable");

  if (gaps.length === 0) gaps.push("No major resource gaps detected");

  return gaps;
}

function getDecisionSummary(score, rainfall, riverLevel, reportCount, region, resources, reports = []) {
  const trappedCount = reports.filter((r) =>
    `${r.description || r.message || ""}`.toLowerCase().includes("trapped")
  ).length;

  const medicalCount = reports.filter((r) =>
    `${r.disaster_type || r.report_type || r.type || ""}`.toLowerCase().includes("medical")
  ).length;

  if (score >= 80) {
    if (!resources.vehicle || !resources.shelterAccess) {
      return `Critical conditions detected in ${region}. Immediate response is required, and the current resource situation may slow evacuation. ${
        trappedCount > 0 ? "Reports indicate people may be trapped." : ""
      } ${medicalCount > 0 ? "Medical support is also needed." : ""}`;
    }
    return `Critical conditions detected in ${region}. Immediate coordinated action and evacuation are required. ${
      trappedCount > 0 ? "Rescue teams should prioritize trapped citizens." : ""
    }`;
  }

  if (score >= 60) {
    return `High-risk situation detected in ${region}. Preventive deployment, shelter preparation, and continuous monitoring are advised. ${
      reportCount > 0 ? "Citizen reports indicate rising ground-level impact." : ""
    }`;
  }

  if (score >= 40) {
    return `Moderate risk in ${region}. Conditions should be monitored closely and local teams should stay prepared.`;
  }

  return `Conditions in ${region} are currently stable, though monitoring remains active.`;
}

function getConfidence(reportCount, historicalFrequency, reports = []) {
  let confidence = 60;
  if (reportCount > 10) confidence += 15;
  if (historicalFrequency > 3) confidence += 10;

  const reportsWithSeverity = reports.filter((r) => r.severity).length;
  if (reportsWithSeverity > 5) confidence += 5;

  return Math.min(confidence, 95);
}

function estimateRiverLevel(baseRiverLevel, rainfall, floodSensitivity) {
  const rise = (rainfall / 50) * floodSensitivity;
  return Number((baseRiverLevel + rise).toFixed(1));
}

const regionProfiles = {
  Punjab: { baseRiverLevel: 5.2, historicalFrequency: 4, floodSensitivity: 1.2 },
  Assam: { baseRiverLevel: 7.4, historicalFrequency: 5, floodSensitivity: 1.5 },
  Delhi: { baseRiverLevel: 3.8, historicalFrequency: 2, floodSensitivity: 0.9 },
  Mumbai: { baseRiverLevel: 4.6, historicalFrequency: 4, floodSensitivity: 1.4 },
  Mathura: { baseRiverLevel: 4.9, historicalFrequency: 3, floodSensitivity: 1.0 },
};

async function getCoordinates(region) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(region)}&count=1`
  );

  if (!res.ok) throw new Error("Failed to fetch location data.");

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Region not found.");
  }

  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
    resolvedName: data.results[0].name,
  };
}

async function getWeatherData(latitude, longitude) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&hourly=precipitation&forecast_days=1`
  );

  if (!res.ok) throw new Error("Failed to fetch weather data.");

  const data = await res.json();
  const hourlyPrecipitation = data.hourly?.precipitation || [];
  const totalRainfall = hourlyPrecipitation.reduce((sum, value) => sum + (value || 0), 0);

  return {
    temperature: data.current?.temperature_2m ?? 0,
    humidity: data.current?.relative_humidity_2m ?? 0,
    rainfall: Number(totalRainfall.toFixed(1)),
  };
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    region: "Punjab",
    rainfall: 0,
    riverLevel: 6.8,
    reportCount: 0,
    reports: [],
    historicalFrequency: 3,
    riskScore: 0,
    riskLevel: "Low",
    recommendations: [],
    temperature: 0,
    humidity: 0,
    confidence: 0,
  });

  const [regionInput, setRegionInput] = useState("Punjab");
  const [citizenAdvice, setCitizenAdvice] = useState([]);
  const [resourceGaps, setResourceGaps] = useState([]);
  const [decisionText, setDecisionText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReports, setShowReports] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [resources, setResources] = useState({
    vehicle: false,
    firstAid: false,
    flashlight: false,
    foodStock: false,
    drinkingWater: false,
    powerBank: false,
    medicines: false,
    shelterAccess: false,
    mobileNetwork: true,
    elderlyAtHome: false,
  });

  const handleResourceChange = useCallback((e) => {
    const { name, checked } = e.target;
    setResources((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }, []);

  const recomputeDerivedState = useCallback((baseData, currentResources) => {
    const actions = getRecommendations(
      baseData.riskScore,
      baseData.riverLevel,
      currentResources,
      baseData.reports || []
    );

    const advice = getCitizenAdvice(
      baseData.riskScore,
      baseData.riverLevel,
      baseData.rainfall,
      baseData.reportCount,
      currentResources,
      baseData.reports || []
    );

    const gaps = getResourceGaps(baseData.riskScore, currentResources);

    const summary = getDecisionSummary(
      baseData.riskScore,
      baseData.rainfall,
      baseData.riverLevel,
      baseData.reportCount,
      baseData.region,
      currentResources,
      baseData.reports || []
    );

    setDashboardData((prev) => ({
      ...prev,
      recommendations: actions,
    }));
    setCitizenAdvice(advice);
    setResourceGaps(gaps);
    setDecisionText(summary);
  }, []);

  const fetchReports = useCallback(async (region) => {
    const normalizedRegion = region.trim();

    const { data, error } = await supabase
      .from("user_reports")
      .select("*")
      .ilike("region", `%${normalizedRegion}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      return [];
    }

    return data || [];
  }, []);

  const saveFusedResult = useCallback(async (dataToSave) => {
    const { error } = await supabase.from("fused_results").insert([
      {
        region: dataToSave.region,
        rainfall: dataToSave.rainfall,
        river_level: dataToSave.riverLevel,
        report_count: dataToSave.reportCount,
        historical_frequency: dataToSave.historicalFrequency,
        risk_score: dataToSave.riskScore,
        risk_level: dataToSave.riskLevel,
        recommendations: dataToSave.recommendations,
      },
    ]);

    if (error) console.log(error.message);
  }, []);

  const runAnalysisForRegion = useCallback(
    async (regionName, customStatus = "") => {
      try {
        setLoading(true);
        setStatusMessage(customStatus || `AI is analyzing ${regionName}...`);

        const reports = await fetchReports(regionName);
        const reportCount = reports.length;

        const { latitude, longitude, resolvedName } = await getCoordinates(regionName);
        const weather = await getWeatherData(latitude, longitude);

        const profile = regionProfiles[resolvedName] || {
          baseRiverLevel: 4.5,
          historicalFrequency: 2,
          floodSensitivity: 1,
        };

        const historicalFrequency = profile.historicalFrequency;
        const riverLevel = estimateRiverLevel(
          profile.baseRiverLevel,
          weather.rainfall,
          profile.floodSensitivity
        );

        const reportImpact = getReportImpact(reports);

        const score = calculateRiskScore({
          rainfall: weather.rainfall,
          riverLevel,
          reportCount,
          historicalFrequency,
          reportImpact,
        });

        const level = getRiskLevel(score);
        const confidence = getConfidence(reportCount, historicalFrequency, reports);

        const finalRecommendations = getRecommendations(score, riverLevel, resources, reports);

        const baseData = {
          region: resolvedName,
          rainfall: weather.rainfall,
          riverLevel,
          reportCount,
          reports,
          historicalFrequency,
          riskScore: score,
          riskLevel: level,
          recommendations: finalRecommendations,
          temperature: weather.temperature,
          humidity: weather.humidity,
          confidence,
        };

        setDashboardData(baseData);
        setCitizenAdvice(
          getCitizenAdvice(
            score,
            riverLevel,
            weather.rainfall,
            reportCount,
            resources,
            reports
          )
        );
        setResourceGaps(getResourceGaps(score, resources));
        setDecisionText(
          getDecisionSummary(
            score,
            weather.rainfall,
            riverLevel,
            reportCount,
            resolvedName,
            resources,
            reports
          )
        );
        setLastUpdated(new Date().toLocaleString());

        await saveFusedResult(baseData);

        if (score >= 80) {
          setStatusMessage(`🚨 Government alert triggered for ${resolvedName}.`);
        } else {
          setStatusMessage(`Analysis completed for ${resolvedName}.`);
        }
      } catch (error) {
        console.log(error);
        setStatusMessage(error.message || "Something went wrong during analysis.");
      } finally {
        setLoading(false);
      }
    },
    [fetchReports, resources, saveFusedResult]
  );

  const initializeDashboard = useCallback(async () => {
    await runAnalysisForRegion("Punjab", "Loading default region analysis...");
  }, [runAnalysisForRegion]);

  const handleRegionSearch = useCallback(async () => {
    if (!regionInput.trim()) return;
    await runAnalysisForRegion(regionInput);
  }, [regionInput, runAnalysisForRegion]);

  const handleDeleteReport = useCallback(
    async (reportId) => {
      const confirmDelete = window.confirm("Do you want to delete this report?");
      if (!confirmDelete) return;

      try {
        setDeletingId(reportId);
        const { error } = await supabase.from("user_reports").delete().eq("id", reportId);

        if (error) {
          console.log(error.message);
          setStatusMessage("Could not delete report.");
          return;
        }

        setStatusMessage("Report deleted successfully.");
        await runAnalysisForRegion(
          dashboardData.region,
          "Updating prediction after report deletion..."
        );
      } catch (error) {
        console.log(error);
        setStatusMessage("Something went wrong while deleting the report.");
      } finally {
        setDeletingId(null);
      }
    },
    [dashboardData.region, runAnalysisForRegion]
  );

  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  useEffect(() => {
    recomputeDerivedState(dashboardData, resources);
  }, [resources, recomputeDerivedState]);

  useEffect(() => {
    const channel = supabase
      .channel("user-reports-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_reports" },
        async () => {
          await runAnalysisForRegion(
            dashboardData.region,
            "New report detected. Updating prediction..."
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dashboardData.region, runAnalysisForRegion]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        <NavBar region={dashboardData.region} riskLevel={dashboardData.riskLevel} />

        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter region (e.g. Delhi, Assam, Mumbai)"
            value={regionInput}
            onChange={(e) => setRegionInput(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 w-full md:w-80 outline-none"
          />

          <button
            onClick={handleRegionSearch}
            disabled={loading}
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-semibold disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          <button
            onClick={() =>
              runAnalysisForRegion(
                dashboardData.region,
                "Refreshing reports and prediction..."
              )
            }
            disabled={loading}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-semibold disabled:opacity-60"
          >
            Refresh Reports
          </button>

          <button
            onClick={() => setShowReports((prev) => !prev)}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold border border-white/10"
          >
            {showReports ? "Hide User Reports" : "Show User Reports"}
          </button>
        </div>

        {statusMessage && <p className="text-cyan-400 mb-2">{statusMessage}</p>}
        {lastUpdated && (
          <p className="text-sm text-slate-400 mb-4">Last updated: {lastUpdated}</p>
        )}

        <AlertBanner riskLevel={dashboardData.riskLevel} region={dashboardData.region} />

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <RiskCard
            title="Risk Level"
            value={dashboardData.riskLevel}
            color="red"
            subtitle="Overall disaster severity"
          />
          <RiskCard
            title="Rainfall"
            value={`${dashboardData.rainfall} mm`}
            color="cyan"
            subtitle="Live weather rainfall"
          />
          <RiskCard
            title="Citizen Reports"
            value={dashboardData.reportCount}
            color="yellow"
            subtitle="Reports from Supabase"
          />
          <RiskCard
            title="Govt Action"
            value={dashboardData.riskScore >= 60 ? "Required" : "Monitor"}
            color="green"
            subtitle="Response priority"
          />
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-5">Area Summary</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/70 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm">Region</p>
                  <p className="text-xl font-semibold text-white mt-2">{dashboardData.region}</p>
                </div>

                <div className="bg-slate-900/70 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm">River Level</p>
                  <p className="text-xl font-semibold text-white mt-2">
                    {dashboardData.riverLevel} m
                  </p>
                </div>

                <div className="bg-slate-900/70 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm">Temperature</p>
                  <p className="text-xl font-semibold text-white mt-2">
                    {dashboardData.temperature} °C
                  </p>
                </div>

                <div className="bg-slate-900/70 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm">Humidity</p>
                  <p className="text-xl font-semibold text-white mt-2">
                    {dashboardData.humidity} %
                  </p>
                </div>

                <div className="bg-slate-900/70 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm">Historical Risk Profile</p>
                  <p className="text-xl font-semibold text-white mt-2">
                    {dashboardData.historicalFrequency}
                  </p>
                </div>

                <div className="bg-slate-900/70 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm">Model Confidence</p>
                  <p className="text-xl font-semibold text-white mt-2">
                    {dashboardData.confidence}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-5">Available Resources</h3>

              <div className="grid md:grid-cols-2 gap-3">
                {[
                  ["vehicle", "Vehicle Available"],
                  ["firstAid", "First Aid Kit"],
                  ["flashlight", "Flashlight / Torch"],
                  ["foodStock", "Dry Food Stock"],
                  ["drinkingWater", "Clean Drinking Water"],
                  ["powerBank", "Power Bank / Backup Power"],
                  ["medicines", "Essential Medicines"],
                  ["shelterAccess", "Nearby Shelter Access"],
                  ["mobileNetwork", "Mobile Network Available"],
                  ["elderlyAtHome", "Elderly / Special Care at Home"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 bg-slate-900/70 rounded-2xl p-4 border border-white/5"
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={resources[key]}
                      onChange={handleResourceChange}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <AnalyticsChart
              rainfall={dashboardData.rainfall}
              riverLevel={dashboardData.riverLevel}
              reportCount={dashboardData.reportCount}
              riskLevel={dashboardData.riskLevel}
            />

            <MapPanel region={dashboardData.region} riskLevel={dashboardData.riskLevel} />

            {showReports && (
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-2xl font-semibold">User Reports</h3>
                  <span className="text-sm text-slate-400">
                    Total: {dashboardData.reports.length}
                  </span>
                </div>

                {dashboardData.reports.length === 0 ? (
                  <p className="text-slate-400">No reports submitted for this region.</p>
                ) : (
                  <div className="grid gap-4">
                    {dashboardData.reports.map((report) => {
                      const title =
                        report.disaster_type ||
                        report.report_type ||
                        report.type ||
                        "General Report";

                      const severity = report.severity || "Unknown";
                      const description =
                        report.description || report.message || "No description provided.";

                      return (
                        <div
                          key={report.id}
                          className="rounded-2xl bg-slate-900/70 border border-white/5 p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                            <p className="text-white font-semibold text-lg">{title}</p>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 w-fit">
                                {severity}
                              </span>

                              <button
                                onClick={() => handleDeleteReport(report.id)}
                                disabled={deletingId === report.id}
                                className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/20 hover:bg-red-500/30 disabled:opacity-50"
                              >
                                {deletingId === report.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-300 text-sm leading-6 mb-3">{description}</p>

                          <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-400">
                            <p>Region: {report.region || dashboardData.region}</p>
                            <p>
                              People affected: {report.people_affected || report.peopleAffected || 0}
                            </p>
                            <p>Status: {report.status || "Pending"}</p>
                            <p>
                              Submitted: {report.created_at
                                ? new Date(report.created_at).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-5">Personalized Precaution Suggestions</h3>

              <div className="grid gap-3">
                {citizenAdvice.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-slate-900/70 border border-white/5 px-4 py-4 text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-5">Need vs Availability Gap</h3>

              <div className="grid gap-3">
                {resourceGaps.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-slate-900/70 border border-white/5 px-4 py-4 text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <GovernmentPanel actions={dashboardData.recommendations} />

            <div className="rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 p-6">
              <p className="text-sm text-cyan-300 mb-2">Decision Engine</p>

              <h3 className="text-xl font-bold text-white mb-3">
                {dashboardData.riskLevel === "Critical"
                  ? "🚨 Immediate Action Required"
                  : dashboardData.riskLevel === "High"
                  ? "⚠️ High Risk Detected"
                  : dashboardData.riskLevel === "Medium"
                  ? "⚡ Moderate Risk"
                  : "✅ Safe Conditions"}
              </h3>

              <p className="text-slate-300 leading-7">{decisionText}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Prototype note: weather and citizen reports are live inputs; river level is modeled from rainfall,
          region profile, and reported ground conditions.
        </p>
      </main>
    </div>
  );
}
