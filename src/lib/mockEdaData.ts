export const mockEdaData = {
  overview: {
    shape: { rows: 13393, columns: 12 },
    columns: ["age", "gender", "height_cm", "weight_kg", "body fat_%", "diastolic", "systolic", "gripForce", "sit and bend forward_cm", "sit-ups counts", "broad jump_cm", "class"]
  },
  missingValues: {
    total: 0,
    perColumn: [
      { column: "age", count: 0, percent: 0.0 },
      { column: "height_cm", count: 0, percent: 0.0 },
      { column: "weight_kg", count: 0, percent: 0.0 },
      { column: "body fat_%", count: 0, percent: 0.0 },
      { column: "diastolic", count: 0, percent: 0.0 },
      { column: "systolic", count: 0, percent: 0.0 },
      { column: "gripForce", count: 0, percent: 0.0 },
      { column: "sit and bend forward_cm", count: 0, percent: 0.0 },
      { column: "sit-ups counts", count: 0, percent: 0.0 },
      { column: "broad jump_cm", count: 0, percent: 0.0 },
    ]
  },
  dataValidity: [
    { rule: "body_fat_% > 70", count: 1, flagged: true },
    { rule: "diastolic < 40", count: 5, flagged: true },
    { rule: "diastolic > 130", count: 0, flagged: false },
    { rule: "systolic < 70", count: 0, flagged: false },
    { rule: "systolic > 200", count: 0, flagged: false },
    { rule: "systolic <= diastolic", count: 5, flagged: true },
    { rule: "gripForce == 0", count: 3, flagged: true },
    { rule: "broad_jump_cm == 0", count: 10, flagged: true },
  ],
  descriptiveStats: [
    { feature: "age", mean: 36.78, median: 32.0, std: 13.63, min: 21.0, max: 64.0, skew: 0.61 },
    { feature: "height_cm", mean: 168.56, median: 169.2, std: 8.43, min: 125.0, max: 193.8, skew: -0.19 },
    { feature: "weight_kg", mean: 67.45, median: 67.4, std: 11.95, min: 26.3, max: 138.1, skew: 0.49 },
    { feature: "body fat_%", mean: 23.24, median: 22.8, std: 7.25, min: 3.0, max: 70.0, skew: 0.35 },
    { feature: "diastolic", mean: 78.80, median: 79.0, std: 10.74, min: 40.0, max: 156.2, skew: 0.28 },
    { feature: "systolic", mean: 130.24, median: 130.0, std: 14.71, min: 70.0, max: 201.0, skew: 0.21 },
    { feature: "gripForce", mean: 36.96, median: 37.9, std: 10.62, min: 0.0, max: 70.5, skew: -0.27 },
    { feature: "sit and bend forward_cm", mean: 15.21, median: 16.2, std: 8.46, min: -25.0, max: 213.0, skew: -0.36 },
    { feature: "sit-ups counts", mean: 39.77, median: 41.0, std: 14.28, min: 0.0, max: 80.0, skew: -0.21 },
    { feature: "broad jump_cm", mean: 190.13, median: 193.0, std: 39.87, min: 0.0, max: 303.0, skew: -0.18 },
  ],
  outliersIQR: [
    { feature: "age", outliers: 0, percent: 0.0, lower: 0.0, upper: 81.5 },
    { feature: "height_cm", outliers: 57, percent: 0.43, lower: 142.25, upper: 195.05 },
    { feature: "weight_kg", outliers: 128, percent: 0.96, lower: 34.6, upper: 99.4 },
    { feature: "body fat_%", outliers: 1, percent: 0.01, lower: 1.0, upper: 44.52 },
    { feature: "diastolic", outliers: 234, percent: 1.75, lower: 52.5, upper: 104.5 },
    { feature: "systolic", outliers: 161, percent: 1.20, lower: 88.5, upper: 172.5 },
    { feature: "gripForce", outliers: 34, percent: 0.25, lower: -1.75, upper: 76.25 },
    { feature: "sit and bend forward_cm", outliers: 494, percent: 3.69, lower: -4.3, upper: 33.3 },
    { feature: "sit-ups counts", outliers: 18, percent: 0.13, lower: -0.5, upper: 79.5 },
    { feature: "broad jump_cm", outliers: 44, percent: 0.33, lower: 75.0, upper: 307.0 },
  ],
  classDistribution: [
    { name: 'Class A', value: 3348, color: '#534AB7' },
    { name: 'Class B', value: 3347, color: '#1D9E75' },
    { name: 'Class C', value: 3349, color: '#EF9F27' },
    { name: 'Class D', value: 3349, color: '#D85A30' },
  ],
  genderDistribution: [
    { name: 'Male', value: 8467, percent: 63.2 },
    { name: 'Female', value: 4926, percent: 36.8 },
  ],
  ageGroupCounts: [
    { group: '21-30', count: 6470 },
    { group: '31-40', count: 2195 },
    { group: '41-50', count: 1863 },
    { group: '51-60', count: 2305 },
    { group: '61+', count: 560 }
  ],
  highCorrelations: [
    { feature1: 'weight_kg', feature2: 'height_cm', r: 0.73 },
    { feature1: 'gripForce', feature2: 'height_cm', r: 0.74 },
    { feature1: 'gripForce', feature2: 'weight_kg', r: 0.70 },
    { feature1: 'broad jump_cm', feature2: 'height_cm', r: 0.67 },
    { feature1: 'broad jump_cm', feature2: 'weight_kg', r: 0.48 },
  ],
  classCorrelationBars: [
    { feature: 'sit and bend forward_cm', r: 0.588 },
    { feature: 'sit-ups counts', r: 0.453 },
    { feature: 'broad jump_cm', r: 0.262 },
    { feature: 'gripForce', r: 0.136 },
    { feature: 'age', r: -0.065 },
    { feature: 'diastolic', r: -0.071 },
    { feature: 'systolic', r: -0.098 },
    { feature: 'body fat_%', r: -0.342 }
  ],
  // Pre-calculated histograms for distributions representation
  ageHistogram: [
    { limit: 25, count: 4200 }, { limit: 30, count: 2270 },
    { limit: 35, count: 1100 }, { limit: 40, count: 1095 },
    { limit: 45, count: 950 }, { limit: 50, count: 913 },
    { limit: 55, count: 1200 }, { limit: 60, count: 1105 },
    { limit: 65, count: 560 }
  ],
  bodyFatHistogram: [
    { limit: 5, count: 120 }, { limit: 10, count: 1050 },
    { limit: 15, count: 2500 }, { limit: 20, count: 3200 },
    { limit: 25, count: 2800 }, { limit: 30, count: 1900 },
    { limit: 35, count: 1050 }, { limit: 40, count: 500 },
    { limit: 45, count: 150 }, { limit: 50, count: 50 }
  ]
};
