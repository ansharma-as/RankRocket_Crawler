from typing import List, Optional
from app.models.schemas import SEOMetrics, Recommendation, RecommendationType
from bson import ObjectId


class MLAnalyzer:
    """ML-driven SEO analysis service"""
    
    def __init__(self):
        self.title_optimal_length = (50, 60)
        self.meta_desc_optimal_length = (150, 160)
        self.h1_optimal_count = 1
        self.internal_external_ratio = 0.8

    async def generate_recommendations(
        self, 
        crawl_result_id, 
        seo_metrics: SEOMetrics,
        user_id: str
    ) -> List[Recommendation]:
        """Generate SEO recommendations based on crawl results"""
        recommendations = []
        
        # Title recommendations
        title_recs = self._analyze_title(crawl_result_id, seo_metrics.title, user_id)
        recommendations.extend(title_recs)
        
        # Meta description recommendations
        meta_desc_recs = self._analyze_meta_description(
            crawl_result_id, seo_metrics.meta_description, user_id
        )
        recommendations.extend(meta_desc_recs)
        
        # Heading structure recommendations
        heading_recs = self._analyze_headings(
            crawl_result_id, seo_metrics.h1_tags, seo_metrics.h2_tags, seo_metrics.h3_tags, user_id
        )
        recommendations.extend(heading_recs)
        
        # Link structure recommendations
        link_recs = self._analyze_links(
            crawl_result_id, seo_metrics.internal_links, seo_metrics.external_links, user_id
        )
        recommendations.extend(link_recs)
        
        # Image recommendations
        image_recs = self._analyze_images(crawl_result_id, seo_metrics.images, user_id)
        recommendations.extend(image_recs)
        
        # Performance recommendations
        perf_recs = self._analyze_performance(
            crawl_result_id, seo_metrics.load_time, seo_metrics.page_size, user_id
        )
        recommendations.extend(perf_recs)
        
        return recommendations

    def _analyze_title(self, crawl_result_id, title: Optional[str], user_id: str) -> List[Recommendation]:
        recommendations = []
        
        if not title:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.TITLE,
                priority="high",
                title="Missing Page Title",
                description="Your page is missing a title tag. This is crucial for SEO.",
                current_value="None",
                suggested_value="Add a descriptive title tag (50-60 characters)",
                impact_score=0.9
            ))
        elif len(title) < self.title_optimal_length[0]:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.TITLE,
                priority="medium",
                title="Title Too Short",
                description="Your title is shorter than the optimal length for SEO.",
                current_value=f"{len(title)} characters",
                suggested_value=f"Expand to {self.title_optimal_length[0]}-{self.title_optimal_length[1]} characters",
                impact_score=0.6
            ))
        elif len(title) > self.title_optimal_length[1]:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.TITLE,
                priority="medium",
                title="Title Too Long",
                description="Your title may be truncated in search results.",
                current_value=f"{len(title)} characters",
                suggested_value=f"Reduce to {self.title_optimal_length[0]}-{self.title_optimal_length[1]} characters",
                impact_score=0.7
            ))
        
        return recommendations

    def _analyze_meta_description(self, crawl_result_id, meta_desc: Optional[str], user_id: str) -> List[Recommendation]:
        recommendations = []
        
        if not meta_desc:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.META_DESCRIPTION,
                priority="high",
                title="Missing Meta Description",
                description="Your page is missing a meta description. This affects click-through rates.",
                current_value="None",
                suggested_value="Add a compelling meta description (150-160 characters)",
                impact_score=0.8
            ))
        elif len(meta_desc) < self.meta_desc_optimal_length[0]:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.META_DESCRIPTION,
                priority="medium",
                title="Meta Description Too Short",
                description="Your meta description could be more descriptive.",
                current_value=f"{len(meta_desc)} characters",
                suggested_value=f"Expand to {self.meta_desc_optimal_length[0]}-{self.meta_desc_optimal_length[1]} characters",
                impact_score=0.5
            ))
        elif len(meta_desc) > self.meta_desc_optimal_length[1]:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.META_DESCRIPTION,
                priority="medium",
                title="Meta Description Too Long",
                description="Your meta description may be truncated in search results.",
                current_value=f"{len(meta_desc)} characters",
                suggested_value=f"Reduce to {self.meta_desc_optimal_length[0]}-{self.meta_desc_optimal_length[1]} characters",
                impact_score=0.6
            ))
        
        return recommendations

    def _analyze_headings(self, crawl_result_id, h1_tags: List[str], h2_tags: List[str], h3_tags: List[str], user_id: str) -> List[Recommendation]:
        recommendations = []
        
        if len(h1_tags) == 0:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.HEADINGS,
                priority="high",
                title="Missing H1 Tag",
                description="Your page is missing an H1 tag, which is important for SEO structure.",
                current_value="0 H1 tags",
                suggested_value="Add exactly 1 H1 tag",
                impact_score=0.8
            ))
        elif len(h1_tags) > self.h1_optimal_count:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.HEADINGS,
                priority="medium",
                title="Multiple H1 Tags",
                description="Multiple H1 tags can confuse search engines about your page's main topic.",
                current_value=f"{len(h1_tags)} H1 tags",
                suggested_value="Use only 1 H1 tag per page",
                impact_score=0.7
            ))
        
        if len(h2_tags) == 0:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.HEADINGS,
                priority="low",
                title="No H2 Tags",
                description="H2 tags help structure your content and improve readability.",
                current_value="0 H2 tags",
                suggested_value="Add H2 tags to structure your content",
                impact_score=0.4
            ))
        
        return recommendations

    def _analyze_links(self, crawl_result_id, internal_links: List[str], external_links: List[str], user_id: str) -> List[Recommendation]:
        recommendations = []
        
        total_links = len(internal_links) + len(external_links)
        
        if total_links == 0:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.LINKS,
                priority="medium",
                title="No Links Found",
                description="Your page has no links, which may hurt SEO and user experience.",
                current_value="0 links",
                suggested_value="Add relevant internal and external links",
                impact_score=0.6
            ))
        elif len(internal_links) == 0:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.LINKS,
                priority="medium",
                title="No Internal Links",
                description="Internal links help search engines understand your site structure.",
                current_value="0 internal links",
                suggested_value="Add internal links to related pages",
                impact_score=0.5
            ))
        elif total_links > 0:
            internal_ratio = len(internal_links) / total_links
            if internal_ratio < self.internal_external_ratio:
                recommendations.append(Recommendation(
                    crawl_result_id=crawl_result_id,
                user_id=user_id,
                    type=RecommendationType.LINKS,
                    priority="low",
                    title="Low Internal Link Ratio",
                    description="Consider adding more internal links to improve site navigation.",
                    current_value=f"{internal_ratio:.2%} internal links",
                    suggested_value=f"Aim for {self.internal_external_ratio:.0%}+ internal links",
                    impact_score=0.3
                ))
        
        return recommendations

    def _analyze_images(self, crawl_result_id, images: List[dict], user_id: str) -> List[Recommendation]:
        recommendations = []
        
        images_without_alt = [img for img in images if not img.get('alt')]
        
        if images_without_alt:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.IMAGES,
                priority="medium",
                title="Images Missing Alt Text",
                description="Alt text improves accessibility and helps search engines understand your images.",
                current_value=f"{len(images_without_alt)} images without alt text",
                suggested_value="Add descriptive alt text to all images",
                impact_score=0.5
            ))
        
        return recommendations

    def _analyze_performance(self, crawl_result_id, load_time: Optional[float], page_size: Optional[int], user_id: str) -> List[Recommendation]:
        recommendations = []
        
        if load_time and load_time > 3.0:
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.PERFORMANCE,
                priority="high",
                title="Slow Page Load Time",
                description="Page load time affects both user experience and SEO rankings.",
                current_value=f"{load_time:.2f} seconds",
                suggested_value="Optimize to load under 3 seconds",
                impact_score=0.8
            ))
        
        if page_size and page_size > 1000000:  # 1MB
            recommendations.append(Recommendation(
                crawl_result_id=crawl_result_id,
                user_id=user_id,
                type=RecommendationType.PERFORMANCE,
                priority="medium",
                title="Large Page Size",
                description="Large page sizes can slow down loading, especially on mobile devices.",
                current_value=f"{page_size / 1024 / 1024:.2f} MB",
                suggested_value="Optimize images and minimize CSS/JS",
                impact_score=0.6
            ))
        
        return recommendations