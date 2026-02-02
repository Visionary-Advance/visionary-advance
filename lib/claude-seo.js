// lib/claude-seo.js
// Claude AI-powered SEO analysis and recommendations

import Anthropic from '@anthropic-ai/sdk';

let anthropicClient = null;

function getClient() {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropicClient;
}

/**
 * Generate AI-powered SEO recommendations based on analytics data
 */
export async function generateAIRecommendations(site, currentMonth, previousMonth, changes) {
  const client = getClient();

  // Prepare the data summary for Claude
  const dataSummary = buildDataSummary(site, currentMonth, previousMonth, changes);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are an expert SEO consultant analyzing a client's Google Search Console data. Based on the data below, provide actionable recommendations to improve their organic search performance.

## Website
${site.display_name} (${site.site_url})

## Performance Data
${dataSummary}

## Instructions
Analyze this data and provide 3-5 specific, actionable recommendations. For each recommendation:
1. Identify the issue or opportunity
2. Explain why it matters
3. Provide specific action steps the client can take

Focus on:
- Quick wins (easy improvements with high impact)
- Content optimization opportunities
- Technical SEO issues if apparent from the data
- Opportunities based on trending queries or pages
- Areas of concern (declining metrics)

Format your response as JSON with this structure:
{
  "summary": "A 2-3 sentence executive summary of the overall SEO performance",
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "Category name",
      "title": "Short title",
      "description": "Detailed explanation of the issue/opportunity",
      "impact": "Expected impact if addressed",
      "actions": ["Action step 1", "Action step 2", "Action step 3"]
    }
  ]
}

Respond ONLY with the JSON, no additional text.`
      }
    ]
  });

  // Parse the response
  const responseText = message.content[0].text;

  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || '',
      recommendations: (parsed.recommendations || []).map((rec, idx) => ({
        id: `ai-rec-${idx}`,
        priority: rec.priority || 'medium',
        category: rec.category || 'SEO',
        title: rec.title || 'Recommendation',
        description: rec.description || '',
        impact: rec.impact || '',
        actions: (rec.actions || []).map(action => ({
          type: 'ai-suggestion',
          suggestion: action
        }))
      }))
    };
  } catch (parseError) {
    console.error('Failed to parse Claude response:', parseError);
    console.error('Raw response:', responseText);

    // Return a fallback response
    return {
      summary: 'Analysis complete. Please review the metrics above for insights.',
      recommendations: [{
        id: 'ai-fallback',
        priority: 'medium',
        category: 'Analysis',
        title: 'Review Your Data',
        description: responseText.substring(0, 500),
        impact: 'Varies based on implementation',
        actions: [{ type: 'ai-suggestion', suggestion: 'Review the full analysis above' }]
      }]
    };
  }
}

/**
 * Build a text summary of the SEO data for Claude
 */
function buildDataSummary(site, currentMonth, previousMonth, changes) {
  const current = currentMonth?.metrics || {};
  const previous = previousMonth?.metrics || {};

  let summary = `### ${currentMonth?.name || 'Current Month'} Performance
- Clicks: ${current.totalClicks?.toLocaleString() || 0}
- Impressions: ${current.totalImpressions?.toLocaleString() || 0}
- CTR: ${((current.avgCtr || 0) * 100).toFixed(2)}%
- Average Position: ${(current.avgPosition || 0).toFixed(1)}

### ${previousMonth?.name || 'Previous Month'} Performance
- Clicks: ${previous.totalClicks?.toLocaleString() || 0}
- Impressions: ${previous.totalImpressions?.toLocaleString() || 0}
- CTR: ${((previous.avgCtr || 0) * 100).toFixed(2)}%
- Average Position: ${(previous.avgPosition || 0).toFixed(1)}

### Month-over-Month Changes
- Clicks: ${changes.clicksChange >= 0 ? '+' : ''}${changes.clicksChange?.toFixed(1) || 0}%
- Impressions: ${changes.impressionsChange >= 0 ? '+' : ''}${changes.impressionsChange?.toFixed(1) || 0}%
- CTR: ${changes.ctrChange >= 0 ? '+' : ''}${(changes.ctrChange * 100)?.toFixed(2) || 0} percentage points
- Position: ${changes.positionChange >= 0 ? 'Improved' : 'Declined'} by ${Math.abs(changes.positionChange || 0).toFixed(1)} positions
`;

  // Add top queries if available
  const topQueries = currentMonth?.dailyData
    ?.flatMap(d => d.queries || [])
    ?.reduce((acc, q) => {
      const key = q.keys?.[0] || q.query;
      if (!key) return acc;
      acc[key] = acc[key] || { clicks: 0, impressions: 0 };
      acc[key].clicks += q.clicks || 0;
      acc[key].impressions += q.impressions || 0;
      return acc;
    }, {});

  if (topQueries && Object.keys(topQueries).length > 0) {
    const sortedQueries = Object.entries(topQueries)
      .sort((a, b) => b[1].clicks - a[1].clicks)
      .slice(0, 10);

    summary += `\n### Top Search Queries (${currentMonth?.name || 'Current Month'})
`;
    sortedQueries.forEach(([query, data], i) => {
      summary += `${i + 1}. "${query}" - ${data.clicks} clicks, ${data.impressions} impressions\n`;
    });
  }

  // Add top pages if available
  const topPages = currentMonth?.dailyData
    ?.flatMap(d => d.pages || [])
    ?.reduce((acc, p) => {
      const key = p.keys?.[0] || p.page;
      if (!key) return acc;
      acc[key] = acc[key] || { clicks: 0, impressions: 0 };
      acc[key].clicks += p.clicks || 0;
      acc[key].impressions += p.impressions || 0;
      return acc;
    }, {});

  if (topPages && Object.keys(topPages).length > 0) {
    const sortedPages = Object.entries(topPages)
      .sort((a, b) => b[1].clicks - a[1].clicks)
      .slice(0, 10);

    summary += `\n### Top Pages (${currentMonth?.name || 'Current Month'})
`;
    sortedPages.forEach(([page, data], i) => {
      let pagePath = page;
      try { pagePath = new URL(page).pathname; } catch {}
      summary += `${i + 1}. ${pagePath} - ${data.clicks} clicks, ${data.impressions} impressions\n`;
    });
  }

  return summary;
}
