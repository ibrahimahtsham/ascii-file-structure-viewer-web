import { Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import FileTreeViewer from "../../../components/FileTreeViewer";
import CodeStats from "../../../components/CodeStats";
import AsciiTree from "../../../components/AsciiTree";

function ResultsSection({ fileData }) {
  const [ignoredItems, setIgnoredItems] = useState([]);

  const handleIgnoreChange = (newIgnoredItems) => {
    setIgnoredItems(newIgnoredItems);
  };

  if (!fileData) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Paper sx={{ p: 2, height: "600px", overflow: "auto" }}>
          <Typography variant="h6" gutterBottom>
            File Structure
          </Typography>
          <FileTreeViewer
            treeData={fileData.structure}
            onIgnoreChange={handleIgnoreChange}
          />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <CodeStats stats={fileData.stats} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <AsciiTree
              asciiTree={fileData.asciiTree}
              treeData={fileData.structure}
              ignoredItems={ignoredItems}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ResultsSection;
