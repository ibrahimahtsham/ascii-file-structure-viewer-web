export class StatsCalculator {
  constructor() {
    this.reset();
  }

  reset() {
    this.stats = {
      totalFiles: 0,
      totalLines: 0,
      fileTypes: {},
      largestFile: { name: "", lines: 0 },
      totalSize: 0,
    };
  }

  updateStats(fileData) {
    this.stats.totalFiles++;
    this.stats.totalLines += fileData.lines || 0;
    this.stats.totalSize += fileData.size || 0;

    const ext = fileData.extension || "no-extension";
    this.stats.fileTypes[ext] = (this.stats.fileTypes[ext] || 0) + 1;

    if ((fileData.lines || 0) > this.stats.largestFile.lines) {
      this.stats.largestFile = {
        name: fileData.name,
        lines: fileData.lines || 0,
      };
    }
  }

  getStats() {
    return { ...this.stats };
  }

  addProcessingTime(processingTime, phaseTimings) {
    return {
      ...this.getStats(),
      processingTime,
      phaseTimings,
    };
  }
}
