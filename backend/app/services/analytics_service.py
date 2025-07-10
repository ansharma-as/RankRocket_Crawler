import asyncio
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from collections import defaultdict
import json
from bson import ObjectId
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64

from app.models.schemas import SEOMetrics, CrawlResult


class AnalyticsService:
    def __init__(self, db):
        self.db = db
        
    async def generate_seo_trends(self, url: Optional[str] = None, 
                                days: int = 30) -> Dict[str, Any]:
        """Generate SEO performance trends"""
        
        # Build query
        query = {}
        if url:
            query["url"] = url
        
        # Date range
        start_date = datetime.utcnow() - timedelta(days=days)
        query["crawled_at"] = {"$gte": start_date}
        
        # Get crawl results
        crawl_results = await self.db.crawl_results.find(query).sort(
            "crawled_at", 1
        ).to_list(length=None)
        
        if not crawl_results:
            return {"message": "No data available for the specified period"}
        
        # Analyze trends
        trends = await self._analyze_performance_trends(crawl_results)
        
        return {
            "period": f"Last {days} days",
            "total_crawls": len(crawl_results),
            "urls_analyzed": len(set(result["url"] for result in crawl_results)),
            "trends": trends,
            "insights": await self._generate_trend_insights(trends),
            "charts": await self._generate_trend_charts(trends)
        }
    
    async def _analyze_performance_trends(self, crawl_results: List[Dict]) -> Dict[str, Any]:
        """Analyze performance trends from crawl results"""
        
        # Initialize trend data
        trends = {
            "dates": [],
            "load_times": [],
            "page_sizes": [],
            "seo_scores": [],
            "accessibility_scores": [],
            "mobile_friendly_count": [],
            "ssl_enabled_count": [],
            "issues_by_priority": {"high": [], "medium": [], "low": []}
        }
        
        # Process each crawl result
        for result in crawl_results:
            try:
                crawl_date = result["crawled_at"]
                seo_metrics = result.get("seo_metrics", {})
                
                trends["dates"].append(crawl_date)
                trends["load_times"].append(seo_metrics.get("load_time") or 0)
                trends["page_sizes"].append(seo_metrics.get("page_size") or 0)
                trends["accessibility_scores"].append(seo_metrics.get("accessibility_score") or 0)
                
                # Calculate SEO score for this result
                recommendations = await self.db.recommendations.find(
                    {"crawl_result_id": str(result["_id"])}
                ).to_list(length=None)
                
                seo_score = await self._calculate_seo_score(seo_metrics, recommendations)
                trends["seo_scores"].append(seo_score or 0)
                
                # Count binary metrics
                trends["mobile_friendly_count"].append(1 if seo_metrics.get("mobile_friendly") else 0)
                trends["ssl_enabled_count"].append(1 if seo_metrics.get("ssl_info", {}).get("ssl_enabled") else 0)
                
                # Count issues by priority
                issue_counts = {"high": 0, "medium": 0, "low": 0}
                if recommendations:
                    for rec in recommendations:
                        priority = rec.get("priority", "medium")
                        if priority in issue_counts:
                            issue_counts[priority] += 1
                
                trends["issues_by_priority"]["high"].append(issue_counts["high"])
                trends["issues_by_priority"]["medium"].append(issue_counts["medium"])
                trends["issues_by_priority"]["low"].append(issue_counts["low"])
            except Exception:
                # Skip problematic records
                continue
        
        return trends
    
    async def _calculate_seo_score(self, seo_metrics: Dict, recommendations: List[Dict]) -> float:
        """Calculate SEO score for a single crawl result"""
        try:
            score = 100.0
            
            # Deduct points for missing elements
            if not seo_metrics.get("title"):
                score -= 15
            if not seo_metrics.get("meta_description"):
                score -= 10
            if not seo_metrics.get("h1_tags"):
                score -= 10
            
            # Deduct points for performance
            load_time = seo_metrics.get("load_time")
            if load_time is not None and load_time > 3:
                score -= min(20, (load_time - 3) * 5)
            
            # Deduct points for recommendations
            if recommendations:
                for rec in recommendations:
                    impact = rec.get("impact_score", 0.5)
                    if impact is not None:
                        if rec.get("priority") == "high":
                            score -= impact * 8
                        elif rec.get("priority") == "medium":
                            score -= impact * 4
                        else:
                            score -= impact * 2
            
            return max(0, min(100, round(score, 1)))
        except Exception:
            return 50.0  # Default score if calculation fails
    
    async def _generate_trend_insights(self, trends: Dict[str, Any]) -> List[str]:
        """Generate insights from trend data"""
        insights = []
        
        if not trends["seo_scores"]:
            return ["Insufficient data for insights"]
        
        # SEO Score trend
        seo_scores = [score for score in trends["seo_scores"] if score is not None]
        if len(seo_scores) >= 2:
            try:
                score_change = seo_scores[-1] - seo_scores[0]
                if score_change > 5:
                    insights.append(f"SEO score improved by {score_change:.1f} points")
                elif score_change < -5:
                    insights.append(f"SEO score declined by {abs(score_change):.1f} points")
                else:
                    insights.append("SEO score remained stable")
            except (TypeError, IndexError):
                pass
        
        # Load time trend
        load_times = [t for t in trends["load_times"] if t is not None and t > 0]
        if load_times:
            try:
                avg_load_time = sum(load_times) / len(load_times)
                if avg_load_time > 3:
                    insights.append(f"Average load time is {avg_load_time:.2f}s - optimization needed")
                elif avg_load_time < 2:
                    insights.append(f"Excellent load time performance ({avg_load_time:.2f}s)")
            except (TypeError, ZeroDivisionError):
                pass
        
        # Page size trend
        page_sizes = [size for size in trends["page_sizes"] if size is not None and size > 0]
        if page_sizes:
            try:
                avg_page_size = sum(page_sizes) / len(page_sizes)
                if avg_page_size > 1000000:  # 1MB
                    insights.append(f"Large average page size ({avg_page_size/1024/1024:.1f}MB)")
            except (TypeError, ZeroDivisionError):
                pass
        
        # Mobile friendliness
        mobile_friendly_count = trends.get("mobile_friendly_count", [])
        if mobile_friendly_count:
            try:
                mobile_count = sum(1 for x in mobile_friendly_count if x == 1)
                total_crawls = len(mobile_friendly_count)
                if total_crawls > 0:
                    mobile_percentage = (mobile_count / total_crawls) * 100
                    if mobile_percentage < 50:
                        insights.append(f"Only {mobile_percentage:.1f}% of pages are mobile-friendly")
            except (TypeError, ZeroDivisionError):
                pass
        
        # SSL adoption
        ssl_enabled_count = trends.get("ssl_enabled_count", [])
        if ssl_enabled_count:
            try:
                ssl_count = sum(1 for x in ssl_enabled_count if x == 1)
                total_crawls = len(ssl_enabled_count)
                if total_crawls > 0:
                    ssl_percentage = (ssl_count / total_crawls) * 100
                    if ssl_percentage < 100:
                        insights.append(f"SSL not enabled on {100-ssl_percentage:.1f}% of crawled pages")
            except (TypeError, ZeroDivisionError):
                pass
        
        return insights
    
    async def _generate_trend_charts(self, trends: Dict[str, Any]) -> Dict[str, str]:
        """Generate base64 encoded charts"""
        charts = {}
        
        if not trends["dates"]:
            return charts
        
        # SEO Score trend chart
        plt.figure(figsize=(10, 6))
        plt.plot(trends["dates"], trends["seo_scores"], marker='o', linewidth=2, markersize=4)
        plt.title('SEO Score Trend')
        plt.xlabel('Date')
        plt.ylabel('SEO Score')
        plt.xticks(rotation=45)
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        charts["seo_score_trend"] = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        # Load time trend chart
        plt.figure(figsize=(10, 6))
        plt.plot(trends["dates"], trends["load_times"], marker='o', linewidth=2, markersize=4, color='orange')
        plt.title('Page Load Time Trend')
        plt.xlabel('Date')
        plt.ylabel('Load Time (seconds)')
        plt.xticks(rotation=45)
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        charts["load_time_trend"] = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        # Issues by priority stacked chart
        plt.figure(figsize=(10, 6))
        plt.stackplot(trends["dates"], 
                     trends["issues_by_priority"]["high"],
                     trends["issues_by_priority"]["medium"],
                     trends["issues_by_priority"]["low"],
                     labels=['High Priority', 'Medium Priority', 'Low Priority'],
                     colors=['#d32f2f', '#f57c00', '#388e3c'],
                     alpha=0.8)
        plt.title('SEO Issues by Priority Over Time')
        plt.xlabel('Date')
        plt.ylabel('Number of Issues')
        plt.legend(loc='upper left')
        plt.xticks(rotation=45)
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        charts["issues_trend"] = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return charts
    
    async def generate_domain_comparison(self, urls: List[str]) -> Dict[str, Any]:
        """Compare SEO performance across multiple domains"""
        
        comparison_data = {}
        
        for url in urls:
            # Get latest crawl result for each URL
            latest_crawl = await self.db.crawl_results.find_one(
                {"url": url},
                sort=[("crawled_at", -1)]
            )
            
            if latest_crawl:
                seo_metrics = latest_crawl["seo_metrics"]
                recommendations = await self.db.recommendations.find(
                    {"crawl_result_id": str(latest_crawl["_id"])}
                ).to_list(length=None)
                
                seo_score = await self._calculate_seo_score(seo_metrics, recommendations)
                
                comparison_data[url] = {
                    "seo_score": seo_score,
                    "load_time": seo_metrics.get("load_time", 0),
                    "page_size": seo_metrics.get("page_size", 0),
                    "mobile_friendly": seo_metrics.get("mobile_friendly", False),
                    "ssl_enabled": seo_metrics.get("ssl_info", {}).get("ssl_enabled", False),
                    "accessibility_score": seo_metrics.get("accessibility_score", 0),
                    "total_issues": len(recommendations),
                    "high_priority_issues": len([r for r in recommendations if r.get("priority") == "high"]),
                    "crawl_date": latest_crawl["crawled_at"]
                }
        
        # Generate comparison insights
        insights = self._generate_comparison_insights(comparison_data)
        
        # Generate comparison chart
        chart = await self._generate_comparison_chart(comparison_data)
        
        return {
            "comparison_data": comparison_data,
            "insights": insights,
            "chart": chart,
            "best_performing": self._find_best_performing(comparison_data),
            "improvement_opportunities": self._find_improvement_opportunities(comparison_data)
        }
    
    def _generate_comparison_insights(self, comparison_data: Dict[str, Dict]) -> List[str]:
        """Generate insights from domain comparison"""
        insights = []
        
        if not comparison_data:
            return ["No data available for comparison"]
        
        # Find best and worst performing domains
        best_seo = max(comparison_data.items(), key=lambda x: x[1]["seo_score"])
        worst_seo = min(comparison_data.items(), key=lambda x: x[1]["seo_score"])
        
        insights.append(f"Best SEO performance: {best_seo[0]} ({best_seo[1]['seo_score']:.1f})")
        insights.append(f"Needs improvement: {worst_seo[0]} ({worst_seo[1]['seo_score']:.1f})")
        
        # Load time comparison
        fastest = min(comparison_data.items(), key=lambda x: x[1]["load_time"])
        slowest = max(comparison_data.items(), key=lambda x: x[1]["load_time"])
        
        insights.append(f"Fastest loading: {fastest[0]} ({fastest[1]['load_time']:.2f}s)")
        insights.append(f"Slowest loading: {slowest[0]} ({slowest[1]['load_time']:.2f}s)")
        
        # Mobile friendliness
        mobile_friendly_count = sum(1 for data in comparison_data.values() if data["mobile_friendly"])
        total_domains = len(comparison_data)
        
        if mobile_friendly_count < total_domains:
            insights.append(f"{total_domains - mobile_friendly_count} domains need mobile optimization")
        
        return insights
    
    async def _generate_comparison_chart(self, comparison_data: Dict[str, Dict]) -> str:
        """Generate comparison chart"""
        if not comparison_data:
            return ""
        
        domains = list(comparison_data.keys())
        seo_scores = [data["seo_score"] for data in comparison_data.values()]
        load_times = [data["load_time"] for data in comparison_data.values()]
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # SEO Score comparison
        bars1 = ax1.bar(domains, seo_scores, color='skyblue', alpha=0.8)
        ax1.set_title('SEO Score Comparison')
        ax1.set_ylabel('SEO Score')
        ax1.set_ylim(0, 100)
        ax1.tick_params(axis='x', rotation=45)
        
        # Add value labels on bars
        for bar, score in zip(bars1, seo_scores):
            ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                    f'{score:.1f}', ha='center', va='bottom')
        
        # Load time comparison
        bars2 = ax2.bar(domains, load_times, color='orange', alpha=0.8)
        ax2.set_title('Load Time Comparison')
        ax2.set_ylabel('Load Time (seconds)')
        ax2.tick_params(axis='x', rotation=45)
        
        # Add value labels on bars
        for bar, time in zip(bars2, load_times):
            ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
                    f'{time:.2f}s', ha='center', va='bottom')
        
        plt.tight_layout()
        
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        chart_data = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return chart_data
    
    def _find_best_performing(self, comparison_data: Dict[str, Dict]) -> Dict[str, str]:
        """Find best performing domain in each category"""
        if not comparison_data:
            return {}
        
        best_performing = {}
        
        # Best SEO score
        best_seo = max(comparison_data.items(), key=lambda x: x[1]["seo_score"])
        best_performing["seo_score"] = f"{best_seo[0]} ({best_seo[1]['seo_score']:.1f})"
        
        # Fastest loading
        fastest = min(comparison_data.items(), key=lambda x: x[1]["load_time"])
        best_performing["load_time"] = f"{fastest[0]} ({fastest[1]['load_time']:.2f}s)"
        
        # Best accessibility
        best_accessibility = max(comparison_data.items(), key=lambda x: x[1]["accessibility_score"])
        best_performing["accessibility"] = f"{best_accessibility[0]} ({best_accessibility[1]['accessibility_score']:.1f})"
        
        return best_performing
    
    def _find_improvement_opportunities(self, comparison_data: Dict[str, Dict]) -> Dict[str, List[str]]:
        """Find improvement opportunities for each domain"""
        opportunities = {}
        
        for url, data in comparison_data.items():
            domain_opportunities = []
            
            if data["seo_score"] < 70:
                domain_opportunities.append("Improve overall SEO score")
            
            if data["load_time"] > 3:
                domain_opportunities.append("Optimize page load time")
            
            if not data["mobile_friendly"]:
                domain_opportunities.append("Implement mobile-friendly design")
            
            if not data["ssl_enabled"]:
                domain_opportunities.append("Enable SSL certificate")
            
            if data["accessibility_score"] < 0.8:
                domain_opportunities.append("Improve accessibility")
            
            if data["high_priority_issues"] > 0:
                domain_opportunities.append(f"Fix {data['high_priority_issues']} high-priority issues")
            
            opportunities[url] = domain_opportunities
        
        return opportunities
    
    async def generate_keyword_analysis(self, url: str) -> Dict[str, Any]:
        """Analyze keyword performance for a URL"""
        
        # Get recent crawl results
        crawl_results = await self.db.crawl_results.find(
            {"url": url}
        ).sort("crawled_at", -1).limit(10).to_list(length=None)
        
        if not crawl_results:
            return {"message": "No crawl data available for keyword analysis"}
        
        # Aggregate keyword data
        keyword_trends = defaultdict(list)
        crawl_dates = []
        
        for result in crawl_results:
            crawl_dates.append(result["crawled_at"])
            keyword_density = result["seo_metrics"].get("keyword_density", {})
            
            for keyword, density in keyword_density.items():
                keyword_trends[keyword].append(density)
        
        # Analyze top keywords
        top_keywords = {}
        for keyword, densities in keyword_trends.items():
            if len(densities) >= 3:  # Only include keywords with sufficient data
                avg_density = sum(densities) / len(densities)
                trend = "increasing" if densities[-1] > densities[0] else "decreasing"
                top_keywords[keyword] = {
                    "average_density": round(avg_density, 2),
                    "current_density": densities[-1],
                    "trend": trend,
                    "appearances": len(densities)
                }
        
        # Sort by average density
        sorted_keywords = dict(sorted(top_keywords.items(), 
                                    key=lambda x: x[1]["average_density"], 
                                    reverse=True)[:20])
        
        return {
            "url": url,
            "analysis_period": f"Last {len(crawl_results)} crawls",
            "top_keywords": sorted_keywords,
            "keyword_opportunities": self._identify_keyword_opportunities(sorted_keywords),
            "optimization_suggestions": self._generate_keyword_suggestions(sorted_keywords)
        }
    
    def _identify_keyword_opportunities(self, keywords: Dict[str, Dict]) -> List[str]:
        """Identify keyword optimization opportunities"""
        opportunities = []
        
        # Find keywords with low density but potential
        low_density_keywords = [k for k, v in keywords.items() if v["average_density"] < 1.0]
        if low_density_keywords:
            opportunities.append(f"Consider increasing density for: {', '.join(low_density_keywords[:3])}")
        
        # Find keywords with declining trends
        declining_keywords = [k for k, v in keywords.items() if v["trend"] == "decreasing"]
        if declining_keywords:
            opportunities.append(f"Keywords losing prominence: {', '.join(declining_keywords[:3])}")
        
        # Find over-optimized keywords
        high_density_keywords = [k for k, v in keywords.items() if v["average_density"] > 5.0]
        if high_density_keywords:
            opportunities.append(f"Potential over-optimization: {', '.join(high_density_keywords[:3])}")
        
        return opportunities
    
    def _generate_keyword_suggestions(self, keywords: Dict[str, Dict]) -> List[str]:
        """Generate keyword optimization suggestions"""
        suggestions = []
        
        if not keywords:
            return ["Add more relevant keywords to your content"]
        
        # General suggestions based on keyword analysis
        suggestions.extend([
            "Focus on long-tail keyword variations",
            "Ensure keywords appear in title and headings",
            "Maintain natural keyword density (1-3%)",
            "Use semantic keywords and synonyms",
            "Monitor keyword performance regularly"
        ])
        
        return suggestions
    
    async def generate_performance_dashboard(self) -> Dict[str, Any]:
        """Generate overall performance dashboard"""
        
        # Get recent statistics
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        # Total crawls
        total_crawls = await self.db.crawl_results.count_documents({
            "crawled_at": {"$gte": start_date}
        })
        
        # Unique URLs
        unique_urls = len(await self.db.crawl_results.distinct("url", {
            "crawled_at": {"$gte": start_date}
        }))
        
        # Average SEO score
        recent_crawls = await self.db.crawl_results.find({
            "crawled_at": {"$gte": start_date}
        }).to_list(length=None)
        
        if recent_crawls:
            seo_scores = []
            for crawl in recent_crawls:
                try:
                    recommendations = await self.db.recommendations.find(
                        {"crawl_result_id": str(crawl["_id"])}
                    ).to_list(length=None)
                    score = await self._calculate_seo_score(crawl["seo_metrics"], recommendations)
                    if score is not None:
                        seo_scores.append(score)
                except Exception:
                    continue
            
            avg_seo_score = sum(seo_scores) / len(seo_scores) if seo_scores else 0
        else:
            avg_seo_score = 0
        
        # Issues breakdown
        all_recommendations = await self.db.recommendations.find({}).to_list(length=None)
        issues_breakdown = {"high": 0, "medium": 0, "low": 0}
        
        for rec in all_recommendations:
            priority = rec.get("priority", "medium")
            if priority in issues_breakdown:
                issues_breakdown[priority] += 1
        
        # Performance metrics
        performance_metrics = {
            "avg_load_time": 0,
            "avg_page_size": 0,
            "mobile_friendly_percentage": 0,
            "ssl_percentage": 0
        }
        
        if recent_crawls:
            load_times = [crawl["seo_metrics"].get("load_time", 0) for crawl in recent_crawls if crawl["seo_metrics"].get("load_time") is not None]
            page_sizes = [crawl["seo_metrics"].get("page_size", 0) for crawl in recent_crawls if crawl["seo_metrics"].get("page_size") is not None]
            mobile_friendly = [crawl["seo_metrics"].get("mobile_friendly", False) for crawl in recent_crawls]
            ssl_enabled = [crawl["seo_metrics"].get("ssl_info", {}).get("ssl_enabled", False) for crawl in recent_crawls]
            
            performance_metrics = {
                "avg_load_time": round(sum(load_times) / len(load_times), 2) if load_times else 0,
                "avg_page_size": round(sum(page_sizes) / len(page_sizes) / 1024, 2) if page_sizes else 0,  # KB
                "mobile_friendly_percentage": round((sum(mobile_friendly) / len(mobile_friendly)) * 100, 1) if mobile_friendly else 0,
                "ssl_percentage": round((sum(ssl_enabled) / len(ssl_enabled)) * 100, 1) if ssl_enabled else 0
            }
        
        return {
            "period": "Last 30 days",
            "overview": {
                "total_crawls": total_crawls,
                "unique_urls": unique_urls,
                "avg_seo_score": round(avg_seo_score, 1),
                "total_issues": sum(issues_breakdown.values())
            },
            "issues_breakdown": issues_breakdown,
            "performance_metrics": performance_metrics,
            "top_issues": await self._get_top_issues(),
            "recommendations": await self._get_dashboard_recommendations(performance_metrics, issues_breakdown)
        }
    
    async def _get_top_issues(self) -> List[Dict[str, Any]]:
        """Get most common SEO issues"""
        pipeline = [
            {"$group": {
                "_id": "$title",
                "count": {"$sum": 1},
                "priority": {"$first": "$priority"}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        
        top_issues = await self.db.recommendations.aggregate(pipeline).to_list(length=None)
        
        return [
            {
                "issue": issue["_id"],
                "count": issue["count"],
                "priority": issue["priority"]
            }
            for issue in top_issues
        ]
    
    async def _get_dashboard_recommendations(self, performance_metrics: Dict, 
                                          issues_breakdown: Dict) -> List[str]:
        """Generate dashboard-level recommendations"""
        recommendations = []
        
        if performance_metrics["avg_load_time"] > 3:
            recommendations.append("Focus on improving page load times across your sites")
        
        if performance_metrics["mobile_friendly_percentage"] < 80:
            recommendations.append("Prioritize mobile-friendly design implementation")
        
        if performance_metrics["ssl_percentage"] < 100:
            recommendations.append("Ensure all sites have SSL certificates enabled")
        
        if issues_breakdown["high"] > 0:
            recommendations.append(f"Address {issues_breakdown['high']} high-priority SEO issues")
        
        if not recommendations:
            recommendations.append("Great job! Continue monitoring and maintaining SEO performance")
        
        return recommendations