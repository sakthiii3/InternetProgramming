<?xml version="1.0" encoding="UTF-8"?>
<!-- UNIT IV: XSLT (eXtensible Stylesheet Language Transformations)
     This stylesheet transforms courses.xml into an HTML table, the same way
     CSS transforms HTML into styled output — but XSLT can restructure the
     data itself, not just style it. Open courses.xml directly in a desktop
     browser (Firefox/Edge) to see this transformation applied automatically. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/courses">
        <html>
            <head>
                <title>Internet Programming Courses (via XSLT)</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #FAF7F0; color: #23272E; margin: 2rem; }
                    h2 { color: #1B2A4A; }
                    table { border-collapse: collapse; width: 100%; background: #fff; }
                    th { background: #1B2A4A; color: #fff; text-align: left; padding: 10px; }
                    td { padding: 10px; border-bottom: 1px solid #E2DACB; }
                    tr:hover { background: #FDF6EC; }
                    .badge { background: #2F6F62; color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 0.8em; }
                </style>
            </head>
            <body>
                <h2>Internet Programming &ndash; Course Catalogue (rendered via XSLT)</h2>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Level</th>
                        <th>Duration</th>
                        <th>Instructor</th>
                        <th>Description</th>
                    </tr>
                    <xsl:for-each select="course">
                        <tr>
                            <td><xsl:value-of select="@id"/></td>
                            <td><xsl:value-of select="title"/></td>
                            <td><span class="badge"><xsl:value-of select="@level"/></span></td>
                            <td><xsl:value-of select="duration"/></td>
                            <td><xsl:value-of select="instructor"/></td>
                            <td><xsl:value-of select="description"/></td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
